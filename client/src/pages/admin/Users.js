import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './Admin.css';

const Users = () => {
  const { token } = useSelector(state => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users);
      } catch (error) {
        console.error('Lỗi lấy users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [token]);

  return (
    <div className="main-content">
      <div className="container">
        <h1>Quản lý người dùng</h1>
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="admin-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? 'Admin' : 'Người dùng'}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;

