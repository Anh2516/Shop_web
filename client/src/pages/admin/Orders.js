import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/orderSlice';
import './Admin.css';

const Orders = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector(state => state.orders);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = async (orderId, newStatus) => {
    await dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
    dispatch(fetchAllOrders());
  };

  const filteredOrders = statusFilter
    ? items.filter(order => order.status === statusFilter)
    : items;

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      shipped: '#007bff',
      completed: '#28a745',
      cancelled: '#dc3545'
    };
    return colors[status] || '#666';
  };

  return (
    <div className="main-content">
      <div className="container">
        <div className="admin-header">
          <h1>Quản lý đơn hàng</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đã giao hàng</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <div className="admin-table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.user_name} ({order.user_email})</td>
                    <td>{order.total.toLocaleString('vi-VN')} đ</td>
                    <td>
                      <span
                        style={{
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="status-select"
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang xử lý</option>
                        <option value="shipped">Đã giao hàng</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                    </td>
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

export default Orders;

