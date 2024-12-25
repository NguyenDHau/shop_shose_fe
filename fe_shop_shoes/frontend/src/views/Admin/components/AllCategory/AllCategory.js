import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Table, Image, Toast, ToastContainer } from "react-bootstrap";
import { Box } from '@mui/material';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [currentCategory, setCurrentCategory] = useState({ id: null, name: "", publicId: "", imageUrl: "" });
  const [imageFile, setImageFile] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const accessToken = localStorage.getItem("accessToken") || "";
    try {
      const response = await fetch("http://localhost:8080/api/categories", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error fetching categories");
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const handleOpenModal = (type, category = { id: null, name: "", publicId: "", imageUrl: "" }) => {
    setModalType(type);
    setCurrentCategory(category);
    setImageFile(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory({ id: null, name: "", publicId: "", imageUrl: "" });
  };

  const showToastMessage = (message, variant = "success") => {
    setToastMessage(message);
    setToastVariant(variant);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveCategory = async () => {
    const accessToken = localStorage.getItem("accessToken") || "";
    try {
      let imageResponse = null;

      if (imageFile) {
        const formDataCloudinary = new FormData();
        formDataCloudinary.append("file", imageFile);
        formDataCloudinary.append("upload_preset", "shoes_preset");

        imageResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/ddbtn5izu/image/upload",
          formDataCloudinary
        );
      }

      const url = modalType === "add"
        ? "http://localhost:8080/api/categories"
        : `http://localhost:8080/api/categories/${currentCategory.id}`;
      const method = modalType === "add" ? "POST" : "PUT";

      const categoryData = {
        ...currentCategory,
        ...(imageResponse && {
          publicId: imageResponse.data.public_id,
          categoryUrl: imageResponse.data.secure_url,
        }),
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error(`Error ${modalType === "add" ? "adding" : "updating"} category`);
      }

      fetchCategories();
      showToastMessage(`Danh mục đã được ${modalType === "add" ? "thêm" : "cập nhật"} thành công!`);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving category", error);
      showToastMessage("Đã xảy ra lỗi, vui lòng thử lại.", "danger");
    }
  };

  const handleDeleteCategory = async (id, publicId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      const accessToken = localStorage.getItem("accessToken") || "";
      try {
        if (publicId) {
          await axios.delete(`http://localhost:8080/api/delete-image?publicId=${publicId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        }

        const response = await fetch(`http://localhost:8080/api/categories/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error deleting category");
        }

        fetchCategories();
        showToastMessage("Danh mục đã được xóa thành công!");
      } catch (error) {
        console.error("Error deleting category", error);
        showToastMessage("Không thể xóa danh mục này.", "danger");
      }
    }
  };

  return (
    <Box sx={{ p: 3, marginTop: '100px', overflowY: 'auto' }}>
    <div className="container mt-5">
      <h2 className="mb-5 text-center text-primary">Quản lý danh mục</h2>
      <Button variant="success" size="lg" className="mb-4" onClick={() => handleOpenModal("add")}>
        + Thêm danh mục
      </Button>

      <Table striped bordered hover className="mt-4 text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Ảnh</th>
            <th>Tên danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index + 1}</td>
              <td>
                {category.categoryUrl && (
                  <Image src={category.categoryUrl} alt="Category" thumbnail width="100" />
                )}
              </td>
              <td className="fw-bold">{category.name}</td>
              <td>
                <Button variant="warning" className="me-3" onClick={() => handleOpenModal("edit", category)}>
                  Sửa
                </Button>
                <Button variant="danger" onClick={() => handleDeleteCategory(category.id, category.publicId)}>
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục"
                value={currentCategory.name}
                onChange={(e) =>
                  setCurrentCategory({ ...currentCategory, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Ảnh</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              {currentCategory.imageUrl && (
                <Image src={currentCategory.imageUrl} alt="Category" thumbnail className="mt-3" />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveCategory}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-center" className="p-3">
        <Toast bg={toastVariant} show={showToast} autohide>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
    </Box>  
  );
};

export default CategoryManager;
