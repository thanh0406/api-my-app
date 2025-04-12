import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CartUser.css';

const CartUser = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const fetchCart = async () => {
    if (!userId) {
      setLoading(false);
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/cart/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy giỏ hàng');
      }
      const data = await response.json();
      const items = data.cart ? data.cart : data;
      const itemsWithChecked = items.map(item => ({ ...item, checked: false }));
      setCartItems(itemsWithChecked);
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const totalPrice = cartItems
    .filter(item => item.checked)
    .reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);

  const increaseQuantity = async (id) => {
    const item = cartItems.find(item => item.id === id);
    const newQuantity = item.quantity + 1;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tăng số lượng');
      }

      const updatedData = await response.json();
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: updatedData.item.quantity } : item
      ));
    } catch (error) {
      console.error('Lỗi khi tăng số lượng:', error.message);
    }
  };

  const decreaseQuantity = async (id) => {
    const item = cartItems.find(item => item.id === id);
    if (item.quantity <= 1) return;
    const newQuantity = item.quantity - 1;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi giảm số lượng');
      }

      const updatedData = await response.json();
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: updatedData.item.quantity } : item
      ));
    } catch (error) {
      console.error('Lỗi khi giảm số lượng:', error.message);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa sản phẩm');
      }

      setCartItems(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error.message);
    }
  };

  const handleCheckboxChange = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.checked);
    if (selectedItems.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
      return;
    }
    navigate('/checkout', { state: { selectedItems, totalPrice } });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h2>Giỏ hàng của bạn</h2>
      </div>

      <div className="cart-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Đang tải giỏ hàng...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <p>Giỏ hàng của bạn đang trống</p>
            <Link to="/" className="continue-shopping">
              <i className="fas fa-arrow-left"></i>
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Chọn</th>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleCheckboxChange(item.id)}
                        className="form-check-input"
                      />
                    </td>
                    <td>
                      <div className="cart-item">
                        <div className="cart-item-image">
                          {item.image_base64 ? (
                            <img src={item.image_base64} alt={item.name} />
                          ) : (
                            <div className="no-image">
                              <i className="fas fa-image"></i>
                            </div>
                          )}
                        </div>
                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-price">{formatPrice(item.price)} VND</div>
                        </div>
                      </div>
                    </td>
                    <td>{formatPrice(item.price)} VND</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          -
                        </button>
                        <span className="quantity-value">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{formatPrice(item.price * item.quantity)} VND</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cart-summary">
              <div className="cart-total">
                <h3>Tổng tiền</h3>
                <div className="total-price">{formatPrice(totalPrice)} VND</div>
              </div>
              <button
                onClick={handleCheckout}
                className="checkout-btn"
              >
                <i className="fas fa-credit-card"></i>
                Thanh toán
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartUser;