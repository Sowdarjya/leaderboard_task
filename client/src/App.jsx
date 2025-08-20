import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [pointHistory, setPointHistory] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              Leaderboard
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Track your progress and compete with others
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center text-white font-bold">
                🎯
              </span>
              Claim Points
            </h3>
            <div className="space-y-4">
              <select
                onChange={(e) => setSelectedUser(e.target.value)}
                value={selectedUser}
                className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all font-medium text-slate-700"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 cursor-pointer rounded-2xl shadow-lg shadow-indigo-200 transition-all duration-200 transform hover:scale-105"
              >
                Claim Points
              </button>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl flex items-center justify-center text-white font-bold">
                👥
              </span>
              Add New User
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter username"
                value={newUser}
                onChange={(e) => setNewUser(e.target.value)}
                className="w-full p-4 bg-white/80 border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all font-medium text-slate-700 placeholder-slate-400"
              />
              <button
                onClick={handleAddUser}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold cursor-pointer py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all duration-200 transform hover:scale-105"
              >
                Add User
              </button>
            </div>
          </div>
        </div>

        {claimedPoints && (
          <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl shadow-lg">
            <p className="text-emerald-700 font-bold text-lg text-center flex items-center justify-center gap-2">
              <span className="text-2xl">🎉</span>
              You claimed{" "}
              <span className="text-emerald-800">{claimedPoints}</span> points!
            </p>
          </div>
        )}

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
            Top Performers
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {users.slice(0, 3).map((user, index) => {
              const podiumColors = [
                "bg-gradient-to-br from-yellow-400 to-amber-500 shadow-yellow-200",
                "bg-gradient-to-br from-slate-300 to-slate-400 shadow-slate-200",
                "bg-gradient-to-br from-orange-400 to-amber-600 shadow-orange-200",
              ];
              const medals = ["🥇", "🥈", "🥉"];
              const positions = ["1st", "2nd", "3rd"];

              return (
                <div
                  key={user._id}
                  className={`${podiumColors[index]} p-8 rounded-3xl shadow-2xl text-center w-64 transform hover:scale-105 transition-all duration-300 border border-white/20`}
                >
                  <div className="text-4xl mb-3">{medals[index]}</div>
                  <h3 className="text-xl font-bold text-white mb-2 drop-shadow-sm">
                    {user.name}
                  </h3>
                  <p className="text-2xl font-black text-white mb-1 drop-shadow-sm">
                    {user.points}
                  </p>
                  <p className="text-white/90 font-medium text-sm">points</p>
                  <div className="mt-3 px-3 py-1 bg-white/20 rounded-full text-white font-semibold text-sm">
                    {positions[index]} Place
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                📊
              </span>
              Rankings
            </h2>
            <div className="space-y-3">
              {currentUsers.map((user, i) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center bg-white/80 p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-sm">
                      {indexOfFirstUser + i + 1}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600 text-lg">
                      {user.points}
                    </span>
                    <span className="text-slate-500 text-sm">pts</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-indigo-100 text-indigo-700 font-bold rounded-xl">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                📈
              </span>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {currentHistory.map((history) => (
                <div
                  key={history._id}
                  className="bg-white/80 p-4 rounded-2xl shadow-sm border border-slate-100 text-slate-700"
                >
                  <span className="font-semibold text-slate-800">
                    {history.userId.name}
                  </span>
                  <span className="text-slate-600"> claimed </span>
                  <span className="font-bold text-emerald-600">
                    {history.points}
                  </span>
                  <span className="text-slate-600"> points</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                onClick={() => setHistoryPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                disabled={historyPage === 1}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-xl">
                {historyPage} / {totalHistoryPages || 1}
              </span>
              <button
                onClick={() =>
                  setHistoryPage((prev) =>
                    Math.min(prev + 1, totalHistoryPages)
                  )
                }
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                disabled={historyPage === totalHistoryPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
