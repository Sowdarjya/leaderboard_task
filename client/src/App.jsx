import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [pointHistory, setPointHistory] = useState([]);

  // Leaderboard pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // History pagination
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 5;

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/api/user/get-users`);
    const sortedUsers = res.data.users.sort((a, b) => b.points - a.points);
    setUsers(sortedUsers);
  };

  const fetchPointHistory = async () => {
    const res = await axios.get(`${API_URL}/api/points/get-points-history`);
    setPointHistory(res.data.pointHistory);
  };

  useEffect(() => {
    fetchUsers();
    fetchPointHistory();
  }, []);

  const handleClaim = async () => {
    if (!selectedUser) return alert("Select a user first");
    const res = await axios.post(
      `${API_URL}/api/points/add-points/${selectedUser}`
    );
    setClaimedPoints(res.data.claimedPoints);
    fetchUsers();
    fetchPointHistory();
  };

  const handleAddUser = async () => {
    if (!newUser) return;
    await axios.post(`${API_URL}/api/user/add-user`, { name: newUser });
    setNewUser("");
    fetchUsers();
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const indexOfLastHistory = historyPage * historyPerPage;
  const indexOfFirstHistory = indexOfLastHistory - historyPerPage;
  const currentHistory = pointHistory.slice(
    indexOfFirstHistory,
    indexOfLastHistory
  );
  const totalHistoryPages = Math.ceil(pointHistory.length / historyPerPage);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">
        🏆 Leaderboard
      </h1>

      {/* Claim Points */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <select
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleClaim}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md transition cursor-pointer"
        >
          Claim Points
        </button>
      </div>

      {claimedPoints && (
        <p className="mb-4 text-green-600 font-semibold">
          🎉 You claimed <b>{claimedPoints}</b> points!
        </p>
      )}

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter new user"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-300"
        />
        <button
          onClick={handleAddUser}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition cursor-pointer"
        >
          Add User
        </button>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Top Performers</h2>
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {users.slice(0, 3).map((user, index) => (
          <div
            key={user._id}
            className={`p-6 rounded-2xl shadow-lg text-center w-48 ${
              index === 0
                ? "bg-yellow-300"
                : index === 1
                ? "bg-gray-300"
                : "bg-orange-300"
            }`}
          >
            <h3 className="text-xl font-bold">{user.name}</h3>
            <p className="text-lg font-medium">{user.points} pts</p>
            <span className="text-sm font-semibold">
              {index === 0
                ? "🥇 1st Place"
                : index === 1
                ? "🥈 2nd Place"
                : "🥉 3rd Place"}
            </span>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
      <div className="w-full max-w-lg space-y-3">
        {currentUsers.map((user, i) => (
          <div
            key={user._id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
          >
            <span className="font-semibold text-gray-700">
              #{indexOfFirstUser + i + 1} {user.name}
            </span>
            <span className="font-bold text-indigo-600">{user.points} pts</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50 cursor-pointer"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1 font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50 cursor-pointer"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      <div className="mt-10 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Point Claim History</h2>
        <ul className="space-y-2">
          {currentHistory.map((history) => (
            <li
              key={history._id}
              className="bg-white p-3 rounded-lg shadow-sm text-gray-700"
            >
              {history.userId.name} claimed{" "}
              <span className="font-semibold">{history.points}</span> points
            </li>
          ))}
        </ul>

        <div className="flex gap-2 mt-4 justify-center">
          <button
            onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50 cursor-pointer"
            disabled={historyPage === 1}
          >
            Prev
          </button>
          <span className="px-3 py-1 font-semibold">
            {historyPage} / {totalHistoryPages || 1}
          </span>
          <button
            onClick={() =>
              setHistoryPage((prev) => Math.min(prev + 1, totalHistoryPages))
            }
            className="px-3 py-1 bg-gray-300 rounded-lg disabled:opacity-50 cursor-pointer"
            disabled={historyPage === totalHistoryPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
