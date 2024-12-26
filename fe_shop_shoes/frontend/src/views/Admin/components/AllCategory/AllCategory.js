import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, Toast } from "react-bootstrap";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showDialog, setShowDialog] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({ name: "", publicId: "", categoryUrl: "" });
  const [imageFile, setImageFile] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [showToast, setShowToast] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleOpenDialog = (category = { name: "", publicId: "", categoryUrl: "" }) => {
    setCurrentCategory(category);
    setImageFile(null);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setCurrentCategory({ name: "", publicId: "", categoryUrl: "" });
  };

  const handleSaveCategory = async () => {
    try {
      let imageResponse = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "shoes_preset");

        imageResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/ddbtn5izu/image/upload",
          formData
        );
      }

      const categoryData = {
        name: currentCategory.name,
        ...(imageResponse && {
          publicId: imageResponse.data.public_id,
          categoryUrl: imageResponse.data.secure_url,
        }),
      };

      if (currentCategory.id) {
        // Update existing category
        await axios.put(`http://localhost:8080/api/categories/${currentCategory.id}`, categoryData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        showToastMessage("Danh mục đã được cập nhật thành công!");
      } else {
        // Add new category
        await axios.post("http://localhost:8080/api/categories", categoryData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        showToastMessage("Danh mục mới đã được thêm thành công!");
      }

      fetchCategories();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving category", error);
      showToastMessage("Có lỗi xảy ra, vui lòng thử lại.", "danger");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await axios.delete(`http://localhost:8080/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        fetchCategories();
        showToastMessage("Danh mục đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting category", error);
        showToastMessage("Không thể xóa danh mục.", "danger");
      }
    }
  };

  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <Box sx={{ p: 3, marginTop: "100px", overflowY: "auto" }}>
      <Paper sx={{ boxShadow: 3, p: 3 }}>
        <Typography variant="h5" align="center" sx={{ mb: 3 }}>
          Quản lý danh mục
        </Typography>

        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
          + Thêm danh mục
        </Button>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Ảnh</TableCell>
                <TableCell align="center">Tên danh mục</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">
                    <Avatar src={category.categoryUrl} alt="Category Image" />
                  </TableCell>
                  <TableCell align="center">{category.name}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleOpenDialog(category)}>Sửa</Button>
                    <Button color="error" onClick={() => handleDeleteCategory(category.id)}>
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={categories.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
        />
      </Paper>

      {/* Dialog */}
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentCategory.id ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tên danh mục"
            value={currentCategory.name}
            onChange={(e) => setCurrentCategory({ ...currentCategory, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" component="label">
            Chọn ảnh
            <input type="file" hidden onChange={(e) => setImageFile(e.target.files[0])} />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleSaveCategory} color="primary">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <ToastContainer position="top-center">
        <Toast show={showToast} bg={toastVariant} autohide>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Box>
  );
};

export default CategoryManager;
