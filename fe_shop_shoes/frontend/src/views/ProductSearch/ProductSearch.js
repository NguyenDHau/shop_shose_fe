import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  CardActionArea,
  CardMedia,
  Paper,
} from "@mui/material";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import axios from "axios";

const ProductSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("accessToken") || "";

  // Extract `categoryId` and `branchId` from state
  const categoryId = location.state?.categoryId || "";
  const branchId = location.state?.branchId || "";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId && !branchId) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:8080/api/products/search", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            categoryId: categoryId || null,
            branchId: branchId || null,
          },
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, branchId, token]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}
      >
        Products
      </Typography>
      {loading ? (
        <Typography align="center">Loading products...</Typography>
      ) : (
        <Paper
          sx={{ p: 3, boxShadow: "none", backgroundColor: "transparent" }}
        >
          <Grid container spacing={4}>
            {products.length > 0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      p: 2,
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => navigate(`/product-detail/${product.id}`)}
                      sx={{ mb: 2 }}
                    >
                      <CardMedia
                        component="img"
                        image={product.fileUrl || "/images/default-product.webp"}
                        alt={product.name}
                        sx={{
                          borderRadius: "8px",
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </CardActionArea>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        fontSize: "16px",
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      color="primary"
                      variant="h6"
                      align="center"
                      sx={{ fontSize: "16px", fontWeight: 600 }}
                    >
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography
                variant="body1"
                sx={{ textAlign: "center", mt: 3, width: "100%" }}
              >
                No products found.
              </Typography>
            )}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ProductSearch;
