import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import ProductDetailPopup from '../Admin/components/popup/ProductDetailPopup';
import axios from 'axios';

function Admin() {
    const [categoryId, setCategoryId] = useState('');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [productCode, setProductCode] = useState('');
    const [productDetails, setProductDetails] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({
        colorName: '',
        sizeQuantityList: [],
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = { headers: { Authorization: `Bearer ${accessToken}` } };
                const response = await axios.get('http://localhost:8080/api/categories', config);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSave = async (data) => {
        try {
            const formData = new FormData();
            formData.append('file', data.image);
            formData.append('upload_preset', 'shoes_preset');

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/ddbtn5izu/image/upload',
                formData
            );
            const imageUrl = response.data.secure_url;
            const public_id = response.data.public_id;
            const signature = response.data.signature;

            const productDetail = {
                ...data,
                fileUrl: imageUrl,
                public_id,
                signature,
            };

            setProductDetails((prevDetails) => [...prevDetails, productDetail]);
            console.log('Thông tin chi tiết sản phẩm đã lưu:', productDetail);
        } catch (error) {
            console.error('Lỗi khi tải lên hình ảnh:', error);
        }
    };

    const getProductColorList = () => {
        return productDetails.map((detail) => ({
            colorId: detail.colorId,
            fileUrl: detail.fileUrl,
            publicId: detail.public_id,
            signature: detail.signature,
        }));
    };

    const getListSize = () => {
        return productDetails.flatMap((detail) =>
            detail.sizeQuantityList.map((size) => ({
                colorId: detail.colorId,
                sizeId: size.sizeId,
                quantity: size.quantity,
            }))
        );
    };

    const handleSaveProduct = async () => {
        const newProduct = {
            categoryId,
            name: productName,
            description,
            price,
            productCode,
            productDetail: getProductColorList(),
            inventory: getListSize(),
        };

        try {
            const accessToken = localStorage.getItem('accessToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.post('http://localhost:8080/api/products', newProduct, config);
            console.log('Product created successfully:', response.data);
            alert('Product created successfully!');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Failed to create product. Please try again.');
        }
    };

    const handleDelete = async (index) => {
        try {
            const publicId = productDetails[index].public_id;

            const response = await axios.delete(
                `http://localhost:8080/api/delete-image?publicId=${publicId}`
            );

            if (response.data.status === 'success') {
                setProductDetails((prevDetails) =>
                    prevDetails.filter((_, detailIndex) => detailIndex !== index)
                );
                console.log('Đã xoá ảnh và thông tin sản phẩm thành công.');
            } else {
                console.error('Không thể xoá ảnh:', response.data);
            }
        } catch (error) {
            console.error('Lỗi khi xoá ảnh hoặc thông tin:', error);
        }
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setEditData({
            colorName: productDetails[index].colorName,
            sizeQuantityList: productDetails[index].sizeQuantityList,
        });
    };

    const handleSaveEdit = () => {
        setProductDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            updatedDetails[editIndex] = {
                ...updatedDetails[editIndex],
                colorName: editData.colorName,
                sizeQuantityList: editData.sizeQuantityList,
            };
            return updatedDetails;
        });
        setEditIndex(null);
    };

    const handleCancelEdit = () => {
        setEditIndex(null);
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>Thêm Sản Phẩm Mới</Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <TextField
                        label="Tên Sản Phẩm"
                        fullWidth
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Mã Sản Phẩm"
                        fullWidth
                        value={productCode}
                        onChange={(e) => setProductCode(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Giá"
                        fullWidth
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        label="Mô Tả"
                        fullWidth
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <select
                        className="form-select"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Chọn Loại Sản Phẩm</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" onClick={handleOpen}>
                        Thêm Màu Sản Phẩm
                    </Button>
                </Grid>
            </Grid>

            <ProductDetailPopup open={open} onClose={handleClose} onSave={handleSave} />

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {productDetails.map((detail, index) => (
                    <Grid item xs={4} key={index}>
                        <div style={{ position: 'relative', textAlign: 'center' }}>
                            <img
                                src={detail.fileUrl}
                                alt={`Color ${detail.colorId}`}
                                style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                            />
                            <Typography>{detail.colorName}</Typography>
                            {editIndex === index ? (
                                <div>
                                    <TextField
                                        label="Tên Màu"
                                        value={editData.colorName}
                                        onChange={(e) => setEditData({ ...editData, colorName: e.target.value })}
                                    />
                                    <Button onClick={handleSaveEdit}>Lưu</Button>
                                    <Button onClick={handleCancelEdit}>Hủy</Button>
                                </div>
                            ) : (
                                <>
                                    <Button onClick={() => handleEdit(index)}>Edit</Button>
                                    <Button onClick={() => handleDelete(index)}>Delete</Button>
                                </>
                            )}
                        </div>
                    </Grid>
                ))}
            </Grid>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProduct}
                style={{ marginTop: '20px' }}
            >
                Lưu
            </Button>
        </div>
    );
}

export default Admin;
