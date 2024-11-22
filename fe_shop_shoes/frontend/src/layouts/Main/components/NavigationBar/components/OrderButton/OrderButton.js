import React from 'react';
import { IconButton, Badge, Avatar } from '@mui/material';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useNavigate } from 'react-router-dom';

const OrderButton = ({ OrderCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <IconButton sx={{ p: 0 }}
      color="primary"
      onClick={() => navigate('/order')} // Điều hướng đến đường dẫn giỏ hàng
    >
      <Badge color="primary">
        <Avatar>
        <LocalMallIcon />
        </Avatar>
      </Badge>
    </IconButton>
  );
};

export default OrderButton;
