import { useEffect, useState } from "react";
import axios from "axios";

const RevenueAdmin = () => {
  const [checkout, setCheckout] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [bestSellerDaily, setBestSellerDaily] = useState(null);
  const [bestSellerMonthly, setBestSellerMonthly] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDateRevenue, setSelectedDateRevenue] = useState(0);
  const [selectedDateBestSeller, setSelectedDateBestSeller] = useState(null);

  useEffect(() => {
    fetchCheckout();
  }, [selectedDate]);

  const fetchCheckout = async () => {
    try {
      const res = await axios.get("http://localhost:3000/checkout");
      const orders = Array.isArray(res.data.data) ? res.data.data : [];
      setCheckout(orders);
      calculateRevenue(orders);
      findBestSellers(orders);
      calculateSelectedDateRevenue(orders);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      setCheckout([]);
    }
  };

  const calculateRevenue = (orders) => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth() + 1;
    let dailyTotal = 0;
    let monthlyTotal = 0;
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const orderDateString = orderDate.toISOString().split("T")[0];
      const orderMonth = orderDate.getMonth() + 1;
      if (orderDateString === today) {
        dailyTotal += parseFloat(order.total_price);
      }
      if (orderMonth === currentMonth) {
        monthlyTotal += parseFloat(order.total_price);
      }
    });
    setDailyRevenue(dailyTotal);
    setMonthlyRevenue(monthlyTotal);
  };

  const findBestSellers = (orders) => {
    const today = new Date().toISOString().split("T")[0];
    const currentMonth = new Date().getMonth() + 1;
    let dailyProducts = {};
    let monthlyProducts = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at);
      const orderDateString = orderDate.toISOString().split("T")[0];
      const orderMonth = orderDate.getMonth() + 1;
      if (!dailyProducts[order.name]) dailyProducts[order.name] = 0;
      if (!monthlyProducts[order.name]) monthlyProducts[order.name] = 0;
      if (orderDateString === today) {
        dailyProducts[order.name] += order.quantity;
      }
      if (orderMonth === currentMonth) {
        monthlyProducts[order.name] += order.quantity;
      }
    });
    const topDaily = Object.entries(dailyProducts).sort((a, b) => b[1] - a[1])[0];
    const topMonthly = Object.entries(monthlyProducts).sort((a, b) => b[1] - a[1])[0];
    setBestSellerDaily(topDaily ? topDaily[0] : "Không có");
    setBestSellerMonthly(topMonthly ? topMonthly[0] : "Không có");
  };

  const calculateSelectedDateRevenue = (orders) => {
    let dateTotal = 0;
    let productsCount = {};
    orders.forEach((order) => {
      const orderDate = new Date(order.created_at).toISOString().split("T")[0];
      if (orderDate === selectedDate) {
        dateTotal += parseFloat(order.total_price);
        if (!productsCount[order.name]) {
          productsCount[order.name] = 0;
        }
        productsCount[order.name] += order.quantity;
      }
    });
    const topProduct = Object.entries(productsCount).sort((a, b) => b[1] - a[1])[0];
    setSelectedDateRevenue(dateTotal);
    setSelectedDateBestSeller(topProduct ? topProduct[0] : "Không có");
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Bảng Điều Khiển Doanh Thu</h2>
      <ul className="nav nav-tabs" id="revenueTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="overview-tab"
            data-bs-toggle="tab"
            data-bs-target="#overview"
            type="button"
            role="tab"
          >
            Tổng Quan
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="daily-tab"
            data-bs-toggle="tab"
            data-bs-target="#daily"
            type="button"
            role="tab"
          >
            Theo Ngày
          </button>
        </li>
      </ul>
      <div className="tab-content" id="revenueTabContent">
        <div className="tab-pane fade show active" id="overview" role="tabpanel">
          <div className="row mt-4">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header bg-info text-white">
                  <h4 className="mb-0">Doanh Thu</h4>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Hôm nay:</strong> {dailyRevenue.toLocaleString()} VNĐ
                  </p>
                  <p>
                    <strong>Tháng này:</strong> {monthlyRevenue.toLocaleString()} VNĐ
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h4 className="mb-0">Sản Phẩm Bán Chạy</h4>
                </div>
                <div className="card-body">
                  <p>
                    <strong>Hôm nay:</strong> {bestSellerDaily}
                  </p>
                  <p>
                    <strong>Tháng này:</strong> {bestSellerMonthly}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-pane fade" id="daily" role="tabpanel">
          <div className="card mt-4">
            <div className="card-header bg-warning text-white">
              <h4 className="mb-0">Thống Kê Theo Ngày</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="selectedDate" className="form-label">
                  Chọn Ngày:
                </label>
                <input
                  id="selectedDate"
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <h5 className="mt-3">Báo Cáo Ngày {selectedDate}</h5>
              <p>
                <strong>Doanh Thu:</strong> {selectedDateRevenue.toLocaleString()} VNĐ
              </p>
              <p>
                <strong>Sản Phẩm Bán Chạy:</strong> {selectedDateBestSeller}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAdmin;
