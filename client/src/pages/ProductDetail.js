import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct, loading } = useSelector(state => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({ product: currentProduct, quantity }));
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  if (loading) {
    return <div className="main-content"><div className="loading">Đang tải...</div></div>;
  }

  if (!currentProduct) {
    return <div className="main-content"><div className="error">Không tìm thấy sản phẩm</div></div>;
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="product-detail">
          <div className="product-image">
            <img src={currentProduct.image || '/placeholder.jpg'} alt={currentProduct.name} />
          </div>
          <div className="product-details">
            <h1>{currentProduct.name}</h1>
            <p className="product-price">{parseFloat(currentProduct.price).toLocaleString('vi-VN')} đ</p>
            <p className="product-description">{currentProduct.description}</p>
            <p className="product-stock">Còn lại: {currentProduct.stock} sản phẩm</p>
            
            <div className="quantity-selector">
              <label>Số lượng:</label>
              <input
                type="number"
                min="1"
                max={currentProduct.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="product-actions">
              <button
                onClick={handleAddToCart}
                disabled={currentProduct.stock === 0}
                className="btn btn-primary"
              >
                Thêm vào giỏ hàng
              </button>
              <button onClick={() => navigate('/products')} className="btn">
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

