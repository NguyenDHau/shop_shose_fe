import React, { useEffect, useState } from 'react';
import { Box, Button, CardActionArea, CardMedia, Grid, Paper, Typography, Link } from '@mui/material';
import { DisplayCurrency } from 'components';
import { useNavigate } from 'react-router-dom';
import Headline from '../Headline';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import { ArrowRight } from '@mui/icons-material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const accessToken = localStorage.getItem('accessToken') || '';

      try {
        const response = await fetch('http://localhost:8080/api/products', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Unable to fetch product list');
        }

        const productsData = await response.json();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Headline
        icon={<NewReleasesIcon color="success" />}
        additionalComponent={
          <Button
            component={Link}
            href="#"
            sx={{ fontSize: 14, color: (theme) => theme.palette.grey[600] }}
            endIcon={<ArrowRight />}
          >
            View all
          </Button>
        }
        sx={{ marginTop: 4 }}
      >
        Products
      </Headline>
      {loading ? (
        <Typography align="center">Đang tải sản phẩm...</Typography>
      ) : (
        <Paper sx={{ p: 3, boxShadow: 'none', backgroundColor: 'transparent' }}>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  <CardActionArea onClick={() => navigate(`/product-detail/${product.id}`)} sx={{ mb: 2 }}>
                    <CardMedia
                      component="img"
                      image={product.fileUrl || '/images/default-product.webp'}
                      alt={product.name}
                      sx={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                      }}
                    />
                  </CardActionArea>
                  <Typography variant="h6" align="center" sx={{ fontSize: '16px', fontWeight: 600 }}>
                    {product.name}
                  </Typography>

                  <Typography
                    color="primary"
                    variant="h6"
                    align="center"
                    sx={{ fontSize: '16px', fontWeight: 600 }}
                  >
                    <DisplayCurrency number={product.price} />
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ProductList;
