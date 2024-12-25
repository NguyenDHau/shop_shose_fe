import { useState, useEffect } from 'react';
import { Typography, Box, Grid, Button, MenuItem, Select } from '@mui/material';
import { useCart } from 'core'; // Import useCart để sử dụng addToCart từ context
import DisplayCurrency from '../../../../components/DisplayCurrency/DisplayCurrency';
import axios from 'axios';

const ProductDetailsCard = ({ products }) => {
  const productArray = Array.isArray(products) ? products : [products];
  const [selectedColorId, setSelectedColorId] = useState('');
  const [currentImage, setCurrentImage] = useState(null); // Lưu ảnh hiện tại
  const [listSize, setListSize] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [inventoryId, setInventoryId] = useState(null);
  const { addToCart } = useCart(); // Lấy addToCart từ context

  const { name, productCode, price } = productArray[0];
  const [listColor, setListColor] = useState(productArray[0]?.listColor || []);
  const [listSizeData, setListSizeData] = useState(productArray[0]?.listSize || []);

  useEffect(() => {
    // Mặc định chọn màu đầu tiên nếu có
    if (listColor.length > 0) {
      handleColorClick(listColor[0].id);
    }
  }, [listColor]);

  // Hàm xử lý khi người dùng chọn màu
  const handleColorClick = (colorId) => {
    setSelectedColorId(colorId);
    const selectedColor = listColor.find((color) => color.id === colorId);
    if (selectedColor) {
      setCurrentImage(selectedColor.fileUrl); // Cập nhật ảnh của màu đã chọn
    }

    // Lọc danh sách size theo màu
    const filteredSizes = listSizeData.filter((size) => size.colorId === colorId);
    setListSize(filteredSizes);
    setSelectedSize(filteredSizes[0]?.id || '');
    setQuantity(filteredSizes[0]?.quantity || 0);

    if (filteredSizes.length > 0) {
      fetchInventoryId(filteredSizes[0]?.id);
    }
  };

  // Lấy inventoryId theo size đã chọn
  const fetchInventoryId = async (sizeId) => {
    try {
      const productId = productArray[0].productId;
      const authToken = localStorage.getItem("accessToken");

      const response = await axios.get("http://localhost:8080/api/inventories/search", {
        params: { productId, colorId: selectedColorId, sizeId },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setInventoryId(response.data);
    } catch (error) {
      console.error("Lỗi khi tìm inventoryId:", error);
      setInventoryId(null);
    }
  };

  const handleAddToCart = () => {
    if (inventoryId) {
      addToCart(inventoryId, 1); // Mỗi lần click sẽ thêm 1 quantity
    } else {
      alert('Vui lòng chọn đầy đủ thông tin.');
    }
  };

  if (!productArray || productArray.length === 0) {
    return <div>Không có chi tiết sản phẩm</div>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Box
            sx={{
              width: 300,
              height: 300,
              mb: 5,
              borderRadius: 2,
              backgroundColor: '#f0f0f0',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {currentImage ? (
              <img src={currentImage} alt="Hình ảnh sản phẩm" style={{ maxWidth: '100%', height: 'auto' }} />
            ) : (
              <Typography variant="body2">Chưa có hình ảnh</Typography>
            )}
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} md={6}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography variant="h4" fontWeight="bold">Mã sản phẩm: {productCode}</Typography>
          <Typography>Tên: <b>{name}</b></Typography>
          <Typography>Giá: <DisplayCurrency number={price} /></Typography>

          {/* Danh sách màu */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {listColor.map((colorObj, index) => (
              <div
                key={index}
                style={{
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: selectedColorId === colorObj.id ? '2px solid blue' : 'none', // Viền khi chọn màu
                  padding: '4px',
                  borderRadius: '4px',
                }}
                onClick={() => handleColorClick(colorObj.id)}
              >
                <img
                  src={colorObj.fileUrl}
                  alt={`Hình ${index + 1}`}
                  style={{
                    width: '50px',
                    height: '50px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
                <p style={{ margin: '4px 0 0', fontSize: '12px' }}>{colorObj.colorName}</p>
              </div>
            ))}
          </div>

          {/* Danh sách size */}
          {/* <Select
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(e.target.value);
              fetchInventoryId(e.target.value);
            }}
            displayEmpty
            sx={{ marginBottom: '16px' }}
          >
            {listSize.map((sizeObj, index) => (
              <MenuItem key={index} value={sizeObj.id}>
                Size: {sizeObj.sizeName}
              </MenuItem>
            ))}
          </Select> */}

          <Select
            value={selectedSize}
            onChange={(e) => {
              const sizeId = e.target.value;
              setSelectedSize(sizeId);

              // Tìm size tương ứng để cập nhật số lượng
              const selectedSizeObj = listSize.find((size) => size.id === sizeId);
              if (selectedSizeObj) {
                setQuantity(selectedSizeObj.quantity); // Cập nhật số lượng
              }

              fetchInventoryId(sizeId); // Gọi API để lấy inventoryId
            }}
            displayEmpty
            sx={{ marginBottom: '16px' }}
          >
            {listSize.map((sizeObj, index) => (
              <MenuItem key={index} value={sizeObj.id}>
                Size: {sizeObj.sizeName}
              </MenuItem>
            ))}
          </Select>


          <Typography>
            {quantity > 0 ? (
              <>
                Số lượng còn: <b>{quantity}</b>
              </>
            ) : (
              <span style={{ color: 'red', fontWeight: 'bold' }}>Hết hàng</span>
            )}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddToCart}
            disabled={quantity === 0} // Disable button nếu hết hàng
          >
            Thêm vào giỏ hàng
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductDetailsCard;
