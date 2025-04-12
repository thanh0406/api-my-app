// Checkout.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { selectedItems, totalPrice } = state || { selectedItems: [], totalPrice: 0 };

  const handleConfirmPayment = async () => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Vui lòng đăng nhập để thanh toán!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          selectedItems,
          totalPrice,
          paymentMethod: 'cash',
          status: 'pending',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi thanh toán');
      }

      const orderData = await response.json();
      const orderId = orderData.orderId;

      // Chuyển sang trang xác nhận đơn hàng với thông tin
      navigate('/oderconfirmation', {
        state: {
          orderId,
          selectedItems,
          totalPrice,
          status: 'pending'
        }
      });

      // Timeout để cập nhật trạng thái sau 15 phút
      setTimeout(async () => {
        await updateOrderStatus(orderId, 'completed');
      }, 15 * 60 * 1000);

    } catch (error) {
      console.error('Lỗi khi thanh toán:', error.message);
      alert('Thanh toán thất bại. Vui lòng thử lại!');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:3000/checkout/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi cập nhật trạng thái đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi:', error.message);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h2>Thanh toán</h2>
      </div>

      <div className="checkout-container">
        {selectedItems.length === 0 ? (
          <div className="empty-checkout">
            <p>Không có sản phẩm nào để thanh toán.</p>
          </div>
        ) : (
          <>
            <table className="checkout-table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{Number(item.price).toLocaleString()} VND</td>
                    <td>{item.quantity}</td>
                    <td>{(Number(item.price) * Number(item.quantity)).toLocaleString()} VND</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="checkout-summary">
              <div className="checkout-total">
                <h3>Tổng tiền</h3>
                <div className="total-amount">{totalPrice.toLocaleString()} VND</div>
              </div>
              <div className="checkout-buttons">
                <button
                  onClick={handleConfirmPayment}
                  className="confirm-btn"
                >
                  <i className="fas fa-credit-card"></i>
                  Xác nhận thanh toán
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="back-btn"
                >
                  <i className="fas fa-arrow-left"></i>
                  Quay lại giỏ hàng
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;