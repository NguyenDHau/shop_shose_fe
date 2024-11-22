import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Typography } from '@mui/material';
import ProductDetailPopup from '../../popup/ProductDetailPopup';
import axios from 'axios';
import { useParams } from 'react-router-dom';


function ProductFormUpdate() {
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
    // biêns ghi nhận sự kiện thêm hoặc sưa (1 = thêm, 2 = sửa)
    const [actionPopup, setActionPopup] = useState(null);
    // object hiện thông tin chi tiết sản phẩm
    const [selectProductDetails, setSelectProductDetails] = useState(null);
    const { id } = useParams();
    const [branchId, setBranchId] = useState('');
    const [branches, setBranches] = useState([]);

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
        const fetchBranches = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = { headers: { Authorization: `Bearer ${accessToken}` } };
                const response = await axios.get('http://localhost:8080/api/branches', config);
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        fetchCategories();
        fetchBranches();
    }, []);

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        setActionPopup(1);
        setEditIndex(null);
    };
    const handleClose = () => setOpen(false);

    const handleSave = async (data) => {
        try {
            if(actionPopup === 2){
                // Cập nhật sản phẩm tại chỉ mục index
                setProductDetails((prevDetails) => {
                    const updatedDetails = [...prevDetails];
                    updatedDetails[editIndex] = data; // Cập nhật sản phẩm tại index
                    return updatedDetails;
                });
            }else{
                productDetails.push(data);
            }
            
            console.log('data', data);
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
            "id": id,
            "categoryId": categoryId,
            "branchId": branchId, // Thêm branchId vào data của sản phẩm
            "name": productName,
            "description": description,
            "price": price,
            "productCode": productCode,
            "productDetail": productDetails
        };
        // console.log('Final productDetails before saving product:', productDetails);
        console.log('Final newProduct before saving product:', newProduct);

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

    const handleEdit = (index, data) => {
        setActionPopup(2);
        setOpen(true);
        setSelectProductDetails(data);
        setEditIndex(index);
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
                const response = await fetch(`http://localhost:8080/api/products/details-update/${id}`, config);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const productData = await response.json();

                // Cập nhật state với dữ liệu từ API
                setCategoryId(productData.categoryId);
                setProductName(productData.name);
                setDescription(productData.description);
                setPrice(productData.price);
                setProductCode(productData.productCode);
                setProductDetails(productData.productDetail);
                setBranchId(productData.branchId);
            } catch (error) {
                console.error('Lỗi khi xoá ảnh hoặc thông tin:', error);
            }
        };

        fetchData();
    }, [id]); // Chỉ chạy một lần khi component được mount


    return (
        <div>
            <Typography variant="h4" gutterBottom>chi tiết sản phẩm</Typography>
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
                    <select
                        className="form-select"
                        value={branchId}
                        onChange={(e) => setBranchId(e.target.value)}  // Thêm onchange cho branchId
                    >
                        <option value="">Chọn thương hiệu</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.branchName}
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

            <ProductDetailPopup open={open} onClose={handleClose} onSave={handleSave}
                status={actionPopup} productDetail={selectProductDetails} />

            <Grid container spacing={2} style={{ marginTop: '20px' }}>
                {/* nội dung chi tiết của sản phẩm */}
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Thông tin ảnh</th>
                            <th scope="col">Chi tiết size và số lượng</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productDetails.map((detail, index) => (
                            <tr>
                                <td>
                                    <img
                                        src={detail.fileUrl}
                                        alt={`Color ${detail.colorId}`}
                                        style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                                    />
                                    <Typography>{detail.colorName}</Typography>
                                </td>
                                <td>
                                    {/* thông tin về kho sản phẩm */}
                                    {
                                        productDetails[index].inventory.map((item) => (
                                            <div>
                                                <Typography>tên size: {item.sizeName}     số lượng: {item.quantity}</Typography>
                                            </div>
                                        ))
                                    }
                                </td>
                                <td>
                                    <Button onClick={() => handleEdit(index, detail)}>Edit</Button>
                                    <Button onClick={() => handleDelete(index)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Grid>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProduct}
                style={{ marginTop: '20px' }}
            >
                Save Product
            </Button>
        </div>
    );
}

export default ProductFormUpdate;
