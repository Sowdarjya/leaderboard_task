import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [claimedPoints, setClaimedPoints] = useState(null);
  const [newUser, setNewUser] = useState("");
  const [pointHistory, setPointHistory] = useState([]);

  const API_URL = "http://localhost:3000";

  const fetchUsers = async () => {
    const res = await axios.get(`${API_URL}/api/user/get-users`);
    const sortedUsers = res.data.users.sort((a, b) => b.points - a.points);
    setUsers(sortedUsers);
    console.log(users);
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
    const sortedUsers = [...users].sort((a, b) => b.points - a.points);
    setUsers(sortedUsers);
    fetchPointHistory();
  };

  const handleAddUser = async () => {
    if (!newUser) return;
    await axios.post(`${API_URL}/api/user/add-user`, { name: newUser });
    setNewUser("");
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🏆 Leaderboard</h1>

      <div>
        <select
          onChange={(e) => setSelectedUser(e.target.value)}
          value={selectedUser}
        >
          <option value="">-- Select User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <button onClick={handleClaim}>Claim Points</button>
      </div>

      {claimedPoints && (
        <p>
          🎉 You claimed <b>{claimedPoints}</b> points!
        </p>
      )}

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Enter new user"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
        />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      <h2 style={{ marginTop: "30px" }}>Leaderboard</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Total Points</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{users.indexOf(user) + 1}</td>
              <td>{user.name}</td>
              <td>{user.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <h2>Point Claim History</h2>
        <ul>
          {pointHistory.map((history) => (
            <li key={history._id}>
              {history.userId.name} claimed {history.points} points
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
