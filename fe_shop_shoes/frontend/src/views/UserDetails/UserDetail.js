import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    Grid,
    Paper,
    Avatar,
    CircularProgress,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import axios from "axios";
import { PageLayout } from "layouts/Main/components";
import { toast } from 'react-toastify';

const UserDetails = ({ userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        avatar: "",
        publicId: "",
        signature: "",
    });

    const [open, setOpen] = useState(false); // State for dialog visibility
    const [avatarFile, setAvatarFile] = useState(null); // File ảnh được chọn
    const [avatarPreview, setAvatarPreview] = useState(""); // URL preview ảnh
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [openEdit, setOpenEdit] = useState(false); // Trạng thái mở popup cập nhật thông tin
    const [openPassword, setOpenPassword] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const accessToken = localStorage.getItem("accessToken") || "";
                const response = await axios.get(
                    `http://localhost:8080/api/auth/user/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setUser(response.data);
                setFormData({
                    firstName: response.data.firstName || "",
                    lastName: response.data.lastName || "",
                    email: response.data.email || "",
                    phoneNumber: response.data.phoneNumber || "",
                    address: response.data.address || "",
                    avatar: response.data.avatar || "", // Thiết lập avatar trong formData
                    publicId: response.data.publicId || "",
                    signature: response.data.signature || "",
                });
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const accessToken = localStorage.getItem("accessToken") || "";
            await axios.put(
                `http://localhost:8080/api/auth/user/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success("Sản phẩm được cập nhật thành công", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setOpen(false); // Close the dialog after successful update
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.success("Sản phẩm cập nhật thất bại", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return (
            <Typography variant="h6" align="center" color="error">
                User not found!
            </Typography>
        );
    }

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formDataCloudinary = new FormData();
            formDataCloudinary.append("file", file);
            formDataCloudinary.append("upload_preset", "shoes_preset"); // Đảm bảo preset này tồn tại trong Cloudinary

            try {
                // Upload ảnh lên Cloudinary
                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/ddbtn5izu/image/upload",
                    formDataCloudinary
                );

                const { secure_url, public_id, signature } = response.data;

                // Cập nhật các trường ảnh trong formData
                setFormData((prev) => ({
                    ...prev,
                    avatar: secure_url,
                    publicId: public_id,
                    signature: signature,
                }));

                // Hiển thị ảnh preview
                setAvatarPreview(secure_url);

                toast.success("Tải ảnh thành công", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } catch (error) {
                console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
                toast.success("Lỗi tải hình ảnh", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        }
    };


    const handleDeleteImage = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken") || "";

            // Gửi yêu cầu xóa ảnh lên Cloudinary thông qua API backend
            const response = await axios.delete(
                `http://localhost:8080/api/delete-image?publicId=${formData.publicId}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (response.data.status === "success") {
                toast.success("Xoá ảnh thành công", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                // Xóa thông tin ảnh trong formData và giao diện
                setFormData((prev) => ({
                    ...prev,
                    avatar: "",
                    publicId: "",
                    signature: "",
                }));
                setAvatarPreview(""); // Xóa ảnh preview
            } else {
                console.error("Không thể xóa ảnh:", response.data);
                toast.success("Không thể xóa ảnh", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
            toast.success("Lôi khi xóa ảnh", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleOpenPassword = () => {
        setOpenPassword(true);
        setErrorMessage(""); // Reset thông báo lỗi
    };
    const handleClosePassword = () => {
        setOpenPassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleSubmitChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
            return;
        }

        try {
            const accessToken = localStorage.getItem("accessToken") || "";
            const userId = localStorage.getItem("userId");

            const response = await axios.put(
                `http://localhost:8080/api/auth/user/${userId}/change-password`,
                null,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    params: {
                        currentPassword: currentPassword,
                        newPassword: newPassword,
                    },
                }
            );

            toast.success(response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            handleClosePassword();
        } catch (error) {
            console.error("Error changing password:", error);
            setErrorMessage(
                error.response?.data?.message || "Đổi mật khẩu thất bại. Vui lòng thử lại."
            );
        }
    };



    return (
        <PageLayout container isAsync={false}>
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 4,
                    boxShadow: 6,
                    backgroundColor: "#f9f9f9",
                    textAlign: "center",
                }}
            >
                <Box position="relative">
                    <Avatar
                        src={avatarPreview || user.avatar || "/default-avatar.png"}
                        alt="User Avatar"
                        sx={{
                            width: 120,
                            height: 120,
                            margin: "0 auto",
                            marginBottom: 2,
                            border: "2px solid #1976d2",
                        }}
                    />
                    <Typography variant="h5">
                        {user.fullName || `${user.firstName} ${user.lastName}`}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        @{user.username}
                    </Typography>
                </Box>

                <Box mt={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Họ"
                                variant="outlined"
                                fullWidth
                                value={user.lastName || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Tên"
                                variant="outlined"
                                fullWidth
                                value={user.firstName || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                value={user.email || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Số điện thoại"
                                variant="outlined"
                                fullWidth
                                value={user.phoneNumber || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Địa chỉ"
                                variant="outlined"
                                fullWidth
                                value={user.address || ""}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                
                <Box mt={3} display="flex" justifyContent="center" gap={2}>
    {/* Nút cập nhật */}
    <Button
        variant="contained"
        onClick={handleOpenEdit}
        sx={{
            backgroundColor: "#1976d2", // Màu nền chính
            color: "#fff",
            fontWeight: "bold",
            textTransform: "none",
            padding: "8px 20px",
            borderRadius: "8px",
            "&:hover": {
                backgroundColor: "#145ca8", // Màu khi hover
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Hiệu ứng nổi
            },
        }}
        startIcon={<i className="fas fa-user-edit"></i>} // Biểu tượng bên trái
    >
        Cập nhật
    </Button>

    {/* Nút đổi mật khẩu */}
    <Button
        variant="outlined"
        onClick={handleOpenPassword}
        sx={{
            borderColor: "#1976d2", // Màu viền chính
            color: "#1976d2",
            fontWeight: "bold",
            textTransform: "none",
            padding: "8px 20px",
            borderRadius: "8px",
            "&:hover": {
                borderColor: "#145ca8", // Màu viền khi hover
                backgroundColor: "#e3f2fd", // Màu nền khi hover
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Hiệu ứng nổi
            },
        }}
        startIcon={<i className="fas fa-key"></i>} // Biểu tượng bên trái
    >
        Đổi Mật Khẩu
    </Button>
</Box>

            </Paper>

            {/* Dialog for updating information */}
            <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm">
                <DialogTitle>Cập nhật thông tin</DialogTitle>
                <DialogContent>
                    <Grid item xs={12}>
                        {/* <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar
                                src={avatarPreview || user?.avatar || "/default-avatar.png"} // Hiển thị avatar mới nếu có
                                alt="User Avatar"
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                            <Button variant="contained" component="label">
                                Chọn ảnh
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleImageChange} // Upload ảnh khi người dùng chọn
                                    accept="image/*"
                                />
                            </Button>
                        </Box> */}
                        <Box display="flex" flexDirection="column" alignItems="center" position="relative">
                            {/* Avatar */}
                            <Box position="relative">
                                <Avatar
                                    src={avatarPreview || formData?.avatar || "/default-avatar.png"} // Hiển thị avatar
                                    alt="User Avatar"
                                    sx={{ width: 100, height: 100, mb: 2 }}
                                />

                                {/* Dấu X để xóa ảnh */}
                                {formData.avatar && (
                                    <Box
                                        onClick={handleDeleteImage}
                                        sx={{
                                            position: "absolute",
                                            top: -10, // Vị trí bên trên ảnh
                                            right: -10, // Vị trí bên phải ảnh
                                            backgroundColor: "red", // Màu nền dấu "X"
                                            color: "white", // Màu chữ
                                            width: 24, // Kích thước hình tròn
                                            height: 24,
                                            borderRadius: "50%", // Bo tròn
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer", // Hiệu ứng con trỏ
                                            fontSize: 16, // Kích thước chữ
                                            zIndex: 10, // Đảm bảo dấu "X" nằm trên avatar
                                        }}
                                    >
                                        x
                                    </Box>
                                )}
                            </Box>

                            {/* Button chọn ảnh */}
                            <Button variant="contained" component="label">
                                Chọn ảnh
                                <input
                                    type="file"
                                    hidden
                                    onChange={handleImageChange} // Upload ảnh khi người dùng chọn
                                    accept="image/*"
                                />
                            </Button>
                        </Box>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Họ"
                                name="lastName"
                                variant="outlined"
                                fullWidth
                                value={formData.lastName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Tên"
                                name="firstName"
                                variant="outlined"
                                fullWidth
                                value={formData.firstName}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Email"
                                name="email"
                                variant="outlined"
                                fullWidth
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Phone Number"
                                name="phoneNumber"
                                variant="outlined"
                                fullWidth
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Address"
                                name="address"
                                variant="outlined"
                                fullWidth
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Lưu Thay Đổi
                    </Button>
                </DialogActions>
            </Dialog>

            

            {/* Popup đổi mật khẩu */}
            <Dialog open={openPassword} onClose={handleClosePassword} fullWidth maxWidth="sm">
                <DialogTitle>Đổi Mật Khẩu</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Mật khẩu hiện tại"
                            type="password"
                            fullWidth
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <TextField
                            label="Mật khẩu mới"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            label="Xác nhận mật khẩu mới"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errorMessage && (
                            <Box color="red" mt={1}>
                                {errorMessage}
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePassword} color="secondary">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmitChangePassword} color="primary" variant="contained">                        Lưu Thay Đổi
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
        </PageLayout>
    );
};

export default UserDetails;
