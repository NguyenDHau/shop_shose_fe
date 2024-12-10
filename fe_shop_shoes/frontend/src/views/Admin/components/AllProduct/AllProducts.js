import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Grid, Paper } from '@mui/material';
import ProductForm from './ProductForm/ProductForm'; // Import component thêm sản phẩm
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      const accessToken = localStorage.getItem('accessToken') || '';
      try {
        const response = await axios.get('http://localhost:8080/api/products', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddProductClick = () => {
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
  };

  const handleNavigateToDetails = (id) => {
    navigate(`/admin/products/details/${id}`);
  };

  return (
    <Box sx={{ p: 3, marginTop: '1000px', overflowY: 'scroll' }}>
      <Typography variant="h4" gutterBottom>Danh Sách Sản Phẩm</Typography>

      {showProductForm ? (
        <ProductForm onClose={handleCloseProductForm} /> // Hiển thị form thêm sản phẩm
      ) : (
        <Grid container spacing={2}>
          {loading ? (
            <Typography align="center">Đang tải sản phẩm...</Typography>
          ) : (
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Paper sx={{ p: 2, textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => handleNavigateToDetails(product.id)}>
                  <img
                    src={product.fileUrl || '/default-image.png'}
                    alt={product.name}
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mt: 1 }}>
                    {product.name}
                  </Typography>
                  <Typography color="primary" sx={{ fontSize: '14px', fontWeight: 600 }}>
                    {product.price} VND
                  </Typography>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
};

export default AllProducts;
