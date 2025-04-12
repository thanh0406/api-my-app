import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Thông tin về shop */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-title">Về MyShop</h5>
            <p className="footer-description">
              MyShop là nền tảng thương mại điện tử hàng đầu, cung cấp các sản phẩm chất lượng với giá cả hợp lý.
              Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
            </p>
          </div>

          {/* Liên kết nhanh */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="footer-title">Liên kết nhanh</h5>
            <ul className="footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/products">Sản phẩm</Link></li>
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Liên hệ</h5>
            <ul className="footer-contact">
              <li>
                <FaPhone className="contact-icon" />
                <span>+84 123 456 789</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>support@myshop.com</span>
              </li>
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
            </ul>
          </div>

          {/* Mạng xã hội */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Kết nối với chúng tôi</h5>
            <div className="social-links">
              <a href="#" className="social-link">
                <FaFacebook />
              </a>
              <a href="#" className="social-link">
                <FaTwitter />
              </a>
              <a href="#" className="social-link">
                <FaInstagram />
              </a>
              <a href="#" className="social-link">
                <FaLinkedin />
              </a>
            </div>
            <div className="newsletter">
              <h6>Đăng ký nhận tin</h6>
              <form className="newsletter-form">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="newsletter-input"
                />
                <button type="submit" className="newsletter-button">
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div className="row">
            <div className="col-md-6">
              <p className="copyright">
                © {new Date().getFullYear()} MyShop. Tất cả quyền được bảo lưu.
              </p>
            </div>
            <div className="col-md-6">
              <div className="payment-methods">
                <img src="/images/payment/visa.png" alt="Visa" />
                <img src="/images/payment/mastercard.png" alt="Mastercard" />
                <img src="/images/payment/paypal.png" alt="PayPal" />
                <img src="/images/payment/momo.png" alt="Momo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 