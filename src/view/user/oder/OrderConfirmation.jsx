import { useLocation, useNavigate } from 'react-router-dom';
import './OrderConfirmation.css';

// Hàm để lưu dữ liệu vào localStorage với thời gian hết hạn
const saveOrderToLocalStorage = (orderData) => {
  const expirationTime = Date.now() + 15 * 60 * 1000; // 15 phút tính bằng milliseconds
  const orderWithExpiration = {
    ...orderData,
    expiresAt: expirationTime,
  };
  localStorage.setItem('tempOrder', JSON.stringify(orderWithExpiration));
};

// Hàm để kiểm tra và xóa dữ liệu nếu hết hạn
const checkAndClearExpiredOrder = () => {
  const savedOrder = localStorage.getItem('tempOrder');
  if (savedOrder) {
    const { expiresAt } = JSON.parse(savedOrder);
    if (Date.now() > expiresAt) {
      localStorage.removeItem('tempOrder');
    }
  }
};

const OrderConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Kiểm tra dữ liệu từ state hoặc localStorage
  let orderData = state;
  if (!orderData) {
    const savedOrder = localStorage.getItem('tempOrder');
    if (savedOrder) {
      const parsedOrder = JSON.parse(savedOrder);
      if (Date.now() <= parsedOrder.expiresAt) {
        orderData = parsedOrder;
      } else {
        localStorage.removeItem('tempOrder');
        return <div>Không có thông tin đơn hàng</div>;
      }
    } else {
      return <div>Không có thông tin đơn hàng</div>;
    }
  } else {
    // Lưu dữ liệu vào localStorage khi nhận được từ state
    saveOrderToLocalStorage(orderData);
  }

  const { orderId, selectedItems, totalPrice, status } = orderData;

  // Kiểm tra và xóa dữ liệu hết hạn
  checkAndClearExpiredOrder();

  return (
    <div className="confirmation-page">
      <div className="confirmation-header">
        <h2>Xác nhận đơn hàng</h2>
      </div>

      <div className="confirmation-container">
        <div className="order-info">
          <p><strong>Mã đơn hàng:</strong> {orderId}</p>
          <p>
            <strong>Trạng thái:</strong>
            <span className={`status-badge status-${status}`}>
              {status === 'pending' ? 'Đang xử lý' : 'Hoàn tất'}
            </span>
          </p>
          <p><strong>Tổng tiền:</strong> {totalPrice.toLocaleString()} VND</p>
          <p><strong>Phương thức thanh toán:</strong> Tiền mặt</p>
        </div>

        <table className="confirmation-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{Number(item.price).toLocaleString()} VND</td>
                <td>{item.quantity}</td>
                <td>{(Number(item.price) * Number(item.quantity)).toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="delivery-info">
          <div className="delivery-icon">🏍️</div>
          <p>Shipper sẽ giao hàng đến bạn trong thời gian sớm nhất!</p>
          <p>Vui lòng chuẩn bị tiền mặt để thanh toán khi nhận hàng.</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button onClick={() => navigate('/')} className="home-btn">
            <i className="fas fa-home"></i>
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;