import React from 'react';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import ListAltIcon from '@mui/icons-material/ListAlt';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonIcon from '@mui/icons-material/Person';

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column p-3"
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#1E1E2F',
        color: '#FFFFFF',
        fontFamily: `'Poppins', sans-serif`,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
      }}
    >
      <h2
        style={{
          marginBottom: '30px',
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: '20px',
          color: '#FFD700',
        }}
      >
        Trang Admin
      </h2>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/admin/dashboard"
            className="nav-link d-flex align-items-center mb-3"
            style={{
              color: '#FFFFFF',
              fontWeight: '500',
              fontSize: '16px',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <DashboardIcon style={{ marginRight: '10px', color: '#FFD700' }} />
            Thống kê
          </Link>
        </li>
        <li>
          <Link
            to="/admin/products/all"
            className="nav-link d-flex align-items-center mb-3"
            style={{
              color: '#FFFFFF',
              fontWeight: '500',
              fontSize: '16px',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <CategoryIcon style={{ marginRight: '10px', color: '#FFD700' }} />
            Sản phẩm
          </Link>
          <ul className="nav flex-column ms-3">
            <li>
              <Link
                to="/admin/products/add"
                className="nav-link d-flex align-items-center mb-2"
                style={{
                  color: '#B0BEC5',
                  fontSize: '14px',
                  textDecoration: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                }}
              >
                <CategoryIcon style={{ marginRight: '10px' }} />
                Thêm sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products/reviews"
                className="nav-link d-flex align-items-center mb-2"
                style={{
                  color: '#B0BEC5',
                  fontSize: '14px',
                  textDecoration: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                }}
              >
                <RateReviewIcon style={{ marginRight: '10px' }} />
                Đánh giá
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link
            to="/admin/categories"
            className="nav-link d-flex align-items-center mb-3"
            style={{
              color: '#FFFFFF',
              fontWeight: '500',
              fontSize: '16px',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <CategoryIcon style={{ marginRight: '10px', color: '#FFD700' }} />
            Danh mục
          </Link>
        </li>
        <li>
          <Link
            to="/admin/orders"
            className="nav-link d-flex align-items-center mb-3"
            style={{
              color: '#FFFFFF',
              fontWeight: '500',
              fontSize: '16px',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <ListAltIcon style={{ marginRight: '10px', color: '#FFD700' }} />
            Đơn hàng
          </Link>
        </li>
        <li>
          <Link
            to="/admin/users"
            className="nav-link d-flex align-items-center mb-3"
            style={{
              color: '#FFFFFF',
              fontWeight: '500',
              fontSize: '16px',
              textDecoration: 'none',
              padding: '10px',
              borderRadius: '8px',
            }}
          >
            <PersonIcon style={{ marginRight: '10px', color: '#FFD700' }} />
            Tài khoản người dùng
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
