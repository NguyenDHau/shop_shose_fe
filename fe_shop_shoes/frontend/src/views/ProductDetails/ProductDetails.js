
import { Box } from '@mui/material';
import ProductDetailsCard from './components/ProductDetailsCard';
import AdditionalInfo from './components/AdditionalInfo';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProductDetails = () => {
  const { id } = useParams(); // Get productCode from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const accessToken = localStorage.getItem('accessToken') || '';

      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        setProduct(data); // Assuming the data might be an array or object
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  const addToCart = (product) => {
    // Sao chép giỏ hàng hiện tại
    const updatedCart = [...cart];
    
    // Tìm sản phẩm trùng khớp `productCode` và `size`
    const existingProductIndex = updatedCart.findIndex(
      (item) => item.productCode === product.productCode && item.size === product.size
    );

    if (existingProductIndex >= 0) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng lên 1
      updatedCart[existingProductIndex].quantity += 1;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
      updatedCart.push({
        productId: product.productId,
        productCode: product.productCode,
        productName: product.Name,
        size: product.size,
        price: product.price,
        quantity: 1,
      });
    }

    // Cập nhật lại giỏ hàng và lưu vào sessionStorage
    setCart(updatedCart);
  };

  

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <Box sx={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', backgroundColor: '#f9f9f9' }}>
      <Box sx={{ marginBottom: '24px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: '#fff' }}>
        <ProductDetailsCard products={product} addToCart={addToCart} /> {/* Truyền hàm addToCart */}
      </Box>

      <Box sx={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px', backgroundColor: '#fff' }}>
        <AdditionalInfo product={product} />
      </Box>
    </Box>
  );
};

export default ProductDetails;
