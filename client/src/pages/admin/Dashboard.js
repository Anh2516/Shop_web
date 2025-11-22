import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './Admin.css';

const Dashboard = () => {
  const { token } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.stats);
      } catch (error) {
        console.error('Lỗi lấy thống kê:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) {
    return <div className="main-content"><div className="loading">Đang tải...</div></div>;
  }

  return (
    <div className="main-content">
      <div className="container">
        <h1>Dashboard Admin</h1>
        <div className="admin-nav">
          <Link to="/admin/products" className="btn btn-primary">Quản lý sản phẩm</Link>
          <Link to="/admin/orders" className="btn btn-primary">Quản lý đơn hàng</Link>
          <Link to="/admin/users" className="btn btn-primary">Quản lý người dùng</Link>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tổng người dùng</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng sản phẩm</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Tổng đơn hàng</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Doanh thu</h3>
            <p className="stat-value">{stats.totalRevenue.toLocaleString('vi-VN')} đ</p>
          </div>
          <div className="stat-card">
            <h3>Đơn hàng hôm nay</h3>
            <p className="stat-value">{stats.recentOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

