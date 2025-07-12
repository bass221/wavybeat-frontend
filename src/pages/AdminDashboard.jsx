import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [beats, setBeats] = useState([]);
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/'); // 🚫 Redirect if not admin
    } else {
      fetchBeats();
    }
  }, []);

  const fetchBeats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/beats');
      setBeats(res.data);
    } catch (err) {
      console.error('❌ Error fetching beats:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this beat?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/beats/${id}`);
      setBeats((prev) => prev.filter((beat) => beat._id !== id));
    } catch (err) {
      console.error('❌ Error deleting beat:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛠️ Admin Dashboard</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Genre</th>
            <th>Price ($)</th>
            <th>Image</th>
            <th>Audio</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {beats.map((beat) => (
            <tr key={beat._id}>
              <td>{beat.title}</td>
              <td>{beat.genre}</td>
              <td>{beat.price}</td>
              <td>
                {beat.imagePath ? (
                  <img
                    src={`http://localhost:5000/${beat.imagePath.replace(/\\/g, '/')}`}
                    alt="Beat Cover"
                    width="100"
                  />
                ) : (
                  <p style={{ color: 'orange' }}>⚠️ No image</p>
                )}
              </td>
              <td>
                {beat.filePath ? (
                  <audio
                    controls
                    src={`http://localhost:5000/${beat.filePath.replace(/\\/g, '/')}`}
                  />
                ) : (
                  <p style={{ color: 'red' }}>❌ No audio file</p>
                )}
              </td>
              <td>
                <button onClick={() => handleDelete(beat._id)}>❌ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
