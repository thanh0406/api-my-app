import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaUser, FaStore } from "react-icons/fa";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Thêm navigate để xử lý đăng xuất

  const userId = localStorage.getItem("userId"); // Kiểm tra trạng thái đăng nhập

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/categories");
        if (!response.ok) throw new Error("Không thể lấy danh mục");
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem("userId");
    localStorage.removeItem("token"); // Nếu bạn dùng token
    localStorage.removeItem("role"); // Nếu bạn lưu role
    navigate("/login"); // Chuyển hướng về trang đăng nhập
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaStore className="store-icon me-2" />
          <span className="brand-text">MyShop</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/homeuser">
                <i className="fas fa-home me-1"></i> Trang chủ
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="categoryDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-th-large me-1"></i> Menu
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="categoryDropdown">
                {loading ? (
                  <li>
                    <span className="dropdown-item text-muted">Đang tải...</span>
                  </li>
                ) : error ? (
                  <li>
                    <span className="dropdown-item text-danger">Lỗi: {error}</span>
                  </li>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        className="dropdown-item"
                        to={`/categorypage/${category.id}`}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="dropdown-item text-muted">Không có danh mục</span>
                  </li>
                )}
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link position-relative" to="/cartuser">
                <FaShoppingCart className="me-1" />
                Giỏ hàng
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                </span>
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaUser className="me-1" />
                {userId ? "Tài khoản" : "Đăng nhập"}
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                {userId ? (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/oderconfirmation">
                        Thông tin đơn hàng
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        Đăng xuất
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link className="dropdown-item" to="/login">
                      Đăng nhập
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;