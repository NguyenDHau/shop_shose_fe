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
        backgroundColor: '#3f51b5',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ marginBottom: '30px', fontWeight: 'bold', textAlign: 'center' }}>Admin Panel</h2>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/admin" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontWeight: '500' }}>
            <DashboardIcon style={{ marginRight: '10px' }} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontWeight: '500' }}>
            <ShoppingCartIcon style={{ marginRight: '10px' }} />
            Products
          </Link>
          <ul className="nav flex-column ms-3">
            <li>
              <Link to="/admin/products/all" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontSize: '14px' }}>
                <CategoryIcon style={{ marginRight: '8px' }} />
                All Products
              </Link>
            </li>
            <li>
              <Link to="/admin/products/add" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontSize: '14px' }}>
                <CategoryIcon style={{ marginRight: '8px' }} />
                Add Product
              </Link>
            </li>
            <li>
              <Link to="/admin/products/categories" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontSize: '14px' }}>
                <CategoryIcon style={{ marginRight: '8px' }} />
                Categories
              </Link>
            </li>
            <li>
              <Link to="/admin/products/reviews" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontSize: '14px' }}>
                <RateReviewIcon style={{ marginRight: '8px' }} />
                Reviews
              </Link>
            </li>
          </ul>
        </li>
        <li>
          <Link to="/admin/inventory" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontWeight: '500' }}>
            <InventoryIcon style={{ marginRight: '10px' }} />
            Inventory
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontWeight: '500' }}>
            <ListAltIcon style={{ marginRight: '10px' }} />
            Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="nav-link text-white d-flex align-items-center mb-2" style={{ fontWeight: '500' }}>
            <PersonIcon style={{ marginRight: '10px' }} />
            Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
