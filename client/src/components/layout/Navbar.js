import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cartItems = useSelector(state => state.cart.items);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          ShopWeb
        </Link>
        <div className="navbar-menu">
          <Link to="/products" className="navbar-link">Sản phẩm</Link>
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link">Admin</Link>
              )}
              <Link to="/cart" className="navbar-link">
                Giỏ hàng {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </Link>
              <span className="navbar-user">Xin chào, {user?.name}</span>
              <button onClick={handleLogout} className="btn btn-primary">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">Đăng nhập</Link>
              <Link to="/register" className="btn btn-success">Đăng ký</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

