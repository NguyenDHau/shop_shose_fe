import { Box, Button, Typography } from '@mui/material';
import { DisplayCurrency } from 'components';

const OrderItem = ({ product }) => {
  const finalPrice = product.price; // Sử dụng giá từ API trực tiếp

  return (
    <Box
      sx={{
        display: 'flex',
        p: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        my: 1,
        flexWrap: 'wrap',
      }}
    >
      <Box display="flex" alignItems="center" overflow="hidden">
        <Box
          component="img"
          sx={{ height: 90, width: 90, borderRadius: 4, mr: 2 }}
          src={product.fileUrl}
          alt={product.productName}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', fontWeight: '500', width: 200 }}>
          <Typography noWrap variant="body">{product.productName}</Typography>
          <Typography variant="overline">
            <DisplayCurrency number={finalPrice} /> x {product.quantity}
          </Typography>
          <Typography variant="caption">
            Color: {product.colorName}, Size: {product.sizeName}
          </Typography>
        </Box>
      </Box>
      <Button color="primary">Write a Review</Button>
    </Box>
  );
};

export default OrderItem;
