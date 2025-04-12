import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy sản phẩm:', error.message);
                if (error.code === 'ERR_NETWORK') {
                    alert('Không thể kết nối đến server. Vui lòng kiểm tra backend!');
                } else {
                    alert('Có lỗi xảy ra khi lấy sản phẩm!');
                }
            }
        };

        fetchProducts();
    }, []);

    const addToCart = (product) => {
        setCart([...cart, product]);
        console.log('Giỏ hàng hiện tại:', [...cart, product]);
    };

    return (
        <div className="category-page">
            <div className="category-header">
            </div>

            <div className="products-grid">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="product-card">
                            <div className="product-image">
                                {product.image_base64 ? (
                                    <img 
                                        src={product.image_base64} 
                                        alt={product.name} 
                                        onError={() => console.log(`Lỗi tải ảnh của ${product.name}`)}
                                    />
                                ) : (
                                    <div className="no-image">
                                        <i className="fas fa-image"></i>
                                    </div>
                                )}
                            </div>
                            <div className="product-info">
                                <h5 className="product-title">{product.name}</h5>
                                <p className="product-description">{product.description}</p>
                                <div className="product-price">{product.price}</div>
                                <Link 
                                    to={`/product/${product.id}`} // Điều hướng tới trang chi tiết
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(product)} // Gọi hàm thêm vào giỏ hàng
                                >
                                    <i className="fas fa-shopping-cart"></i>
                                    Thêm vào giỏ hàng
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-products">
                        <i className="bi bi-cart-x"></i>
                        <p>Không có sản phẩm nào để hiển thị.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;