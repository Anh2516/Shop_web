import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import './Products.css';

const Products = () => {
  const dispatch = useDispatch();
  const { items, loading, pagination, error } = useSelector(state => state.products);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ search, page, limit: 12 }));
  }, [dispatch, search, page]);

  return (
    <div className="main-content">
      <div className="container">
        <h1 className="page-title">Danh sách sản phẩm</h1>
        
        <div className="products-filters">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>

        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : error ? (
          <div className="error-message">
            <p>❌ Lỗi: {error}</p>
            <button onClick={() => dispatch(fetchProducts({ search, page, limit: 12 }))} className="btn btn-primary">
              Thử lại
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-message">
            <p>Không có sản phẩm nào</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {items.map(product => (
                <div key={product.id} className="product-card">
                  <img src={product.image || '/placeholder.jpg'} alt={product.name} />
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description?.substring(0, 100)}...</p>
                    <p className="product-price">{parseFloat(product.price).toLocaleString('vi-VN')} đ</p>
                    <p className="product-stock">Còn lại: {product.stock} sản phẩm</p>
                    <Link to={`/products/${product.id}`} className="btn btn-primary">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn"
                >
                  Trước
                </button>
                <span>Trang {page} / {pagination.pages}</span>
                <button
                  onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                  className="btn"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;

