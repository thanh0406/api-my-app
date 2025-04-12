import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await fetch(`http://localhost:3000/categories/${id}`);
        if (!response.ok) throw new Error("Không thể lấy thông tin danh mục");
        const data = await response.json();
        setCategoryName(data.name);
      } catch (err) {
        console.error("Lỗi lấy thông tin danh mục:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3000/products?categoryId=${id}`);
        if (!response.ok) throw new Error("Không thể lấy sản phẩm");
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategoryName();
    fetchProducts();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <div className="category-page">
      <div className="category-header">
        <h2>{categoryName}</h2>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Đang tải sản phẩm...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>Lỗi: {error}</p>
        </div>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image_base64 ? (
                  <img src={product.image_base64} alt={product.name} />
                ) : (
                  <div className="no-image">
                    <i className="fas fa-image"></i>
                  </div>
                )}
                {product.discount && (
                  <div className="product-badge">
                    -{product.discount}%
                  </div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-price">
                  {formatPrice(product.price)}
                </div>
                <Link
                  to={`/product/${product.id}`}
                  className="add-to-cart-btn"
                >
                  <i className="fas fa-shopping-cart"></i>
                  Thêm vào giỏ hàng
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-products">
          <i className="fas fa-box-open"></i>
          <p>Không có sản phẩm nào trong danh mục này.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;