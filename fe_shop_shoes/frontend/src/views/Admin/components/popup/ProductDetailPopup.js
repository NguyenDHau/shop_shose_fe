
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';

function ProductDetailPopup({ open, onClose, onSave, status, productDetail }) {
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [selectedColorId, setSelectedColorId] = useState('');
    const [selectedSizeId, setSelectedSizeId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [sizeQuantityList, setSizeQuantityList] = useState([]);

    // chô upload anh
    const [image, setImage] = useState(null); // Tệp hình ảnh tạm thời
    const [fileUrl, setFileUrl] = useState(''); // URL hình ảnh đã tải lên
    const [fileName, setFileName] = useState(''); // Tên hình ảnh
    const [signature, setSignature] = useState(null);
    const [publicId, setPublicId] = useState(null);


    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Lấy tên file
            setFileName(file.name);

            // Tạo formData và đẩy lên Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'shoes_preset'); // Đảm bảo đã cấu hình upload preset trong Cloudinary

            try {
                // Upload lên Cloudinary
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/ddbtn5izu/image/upload',
                    formData
                );

                // xoá ảnh trước đó

                // Lấy URL ảnh đã upload từ Cloudinary
                setFileUrl(response.data.secure_url);
                setImage(file);
                setFileName(file.name);
                setSignature(response.data.signature);
                setPublicId(response.data.public_id);
            } catch (error) {
                console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
            }
        }
    };

    useEffect(() => {

        if (open) {
            // Reset tất cả các state khi mở lại popup
            setColors([]);
            setSizes([]);
            setSelectedColorId('');
            setSelectedSizeId('');
            setQuantity('');
            setSizeQuantityList([]);
            setImage(null);
            setFileUrl('');
            setFileName('');
            setSignature(null);
            setPublicId(null);
        }

        const fetchColors = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = { headers: { Authorization: `Bearer ${accessToken}` } };
                const response = await axios.get('http://localhost:8080/api/colors', config);
                setColors(response.data);
            } catch (error) {
                console.error('Lỗi khi gọi API colors:', error);
            }
        };

        const fetchSizes = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = { headers: { Authorization: `Bearer ${accessToken}` } };
                const response = await axios.get('http://localhost:8080/api/sizes', config);
                setSizes(response.data);
            } catch (error) {
                console.error('Lỗi khi gọi API sizes:', error);
            }
        };

        fetchColors();
        fetchSizes();

        // set thông tin edit
        if (status === 2) {
            setSelectedColorId(productDetail.colorId);
            console.log('selectedColorId:', selectedColorId);
            setSizeQuantityList(productDetail.inventory);

            // set thông tin ảnh
            setFileUrl(productDetail.fileUrl);
            setFileName(productDetail.fileName);
            setSignature(productDetail.signature);
            setPublicId(productDetail.publicId);

        }
    }, [open]);

    const handleColorSelectChange = (e) => {
        setSelectedColorId(e.target.value);
    };

    const handleSizeSelectChange = (e) => {
        setSelectedSizeId(e.target.value);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleAddSizeQuantity = () => {
        if (selectedSizeId && quantity) {
            const sizeIdNumber = Number(selectedSizeId);
            const quantityNumber = Number(quantity);

            setSizeQuantityList((prevList) => {
                const existingSize = prevList.find((item) => item.sizeId === sizeIdNumber);

                if (existingSize) {
                    // Nếu size đã tồn tại, chỉ cần cập nhật số lượng và thêm sizeName
                    return prevList.map((item) =>
                        item.sizeId === sizeIdNumber
                            ? {
                                ...item,
                                quantity: item.quantity + quantityNumber,
                                sizeName: sizes.find(size => size.id === sizeIdNumber)?.sizeName || '' // Thêm sizeName vào
                            }
                            : item
                    );
                } else {
                    // Nếu size chưa tồn tại, tạo mới với sizeName
                    const sizeName = sizes.find(size => size.id === sizeIdNumber)?.sizeName || '';
                    return [...prevList, { sizeId: sizeIdNumber, quantity: quantityNumber, sizeName }];
                }
            });

            // Reset the selected size and quantity
            setSelectedSizeId('');
            setQuantity('');
        } else {
            alert('Vui lòng chọn kích thước và nhập số lượng!');
        }
    };

    const handleDeleteSizeQuantity = (indexToDelete) => {
        setSizeQuantityList((prevList) => prevList.filter((_, index) => index !== indexToDelete));
    };

    const handleSave = () => {
        const color = colors.find((c) => c.id === Number(selectedColorId));
        const colorName = color ? color.colorName : '';

        // Lấy danh sách sizeName từ sizeQuantityList
        const sizeQuantityWithNames = sizeQuantityList.map((item) => {
            const size = sizes.find((s) => s.id === item.sizeId);
            return {
                ...item,
                sizeName: size ? size.sizeName : '',
            };
        });

        // Kiểm tra các điều kiện
        if (selectedColorId && sizeQuantityList.length > 0) {
            const data = {
                colorId: Number(selectedColorId),
                colorName: colorName,
                fileUrl: fileUrl, // URL của ảnh từ Cloudinary
                publicId: publicId, // Public ID của ảnh từ Cloudinary
                signature: signature, // Signature của ảnh từ Cloudinary
                fileName: fileName, // Tên file của ảnh từ Cloudinary
                inventory: sizeQuantityWithNames.map(item => ({
                    sizeId: item.sizeId.toString(), // Đảm bảo sizeId là chuỗi
                    sizeName: item.sizeName,
                    quantity: item.quantity.toString() // Đảm bảo quantity là chuỗi
                }))
            };

            // Trả dữ liệu lên component cha
            onSave(data);
            onClose();
        } else {
            alert('Vui lòng chọn màu, tải lên hình ảnh và thêm kích thước cũng như số lượng!');
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{"Thông báo"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Tên Màu:</span>
                        <select className="form-select" onChange={handleColorSelectChange} value={selectedColorId}>
                            <option value="">Chọn tên màu</option>
                            {colors.map((color) => (
                                <option key={color.id} value={color.id}>
                                    {color.colorName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="d-flex mb-3">
                        <div className="me-2">
                            <span className="input-group-text">Kích Thước:</span>
                            <select className="form-select" onChange={handleSizeSelectChange} value={selectedSizeId}>
                                <option value="">Chọn kích thước</option>
                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.sizeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="ms-2">
                            <span className="input-group-text">Số Lượng:</span>
                            <input
                                type="number"
                                className="form-control"
                                value={quantity}
                                onChange={handleQuantityChange}
                                placeholder="Số lượng"
                            />
                        </div>
                        <Button variant="contained" color="primary" onClick={handleAddSizeQuantity} className="ms-2">
                            Thêm
                        </Button>
                    </div>
                    <div>
                        <h5>Danh sách Kích Thước & Số Lượng:</h5>
                        <ul>
                            {sizeQuantityList.map((item, index) => (
                                <li key={index}>
                                    Kích Thước: {item.sizeName}, Số Lượng: {item.quantity}
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDeleteSizeQuantity(index)}
                                        className="ms-2"
                                        size="small"
                                    >
                                        Xóa
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="container mt-4">
                        <div className="mb-3">
                            <label htmlFor="formFile" className="form-label">
                                Chọn Ảnh
                            </label>
                            <input
                                hidden
                                className="form-control"
                                type="file"
                                id="formFile"
                                onChange={handleImageChange}
                                accept="image/*"
                            />
                        </div>

                        {fileUrl && (
                            <div className="mt-3">
                                <h5>Tên Hình Ảnh: {fileName}</h5>
                                <img src={fileUrl} alt="Uploaded" style={{ width: '200px', height: 'auto' }} />
                            </div>
                        )}
                    </div>

                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Đóng
                </Button>
                <Button onClick={handleSave} color="primary" autoFocus>
                    Đồng ý
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductDetailPopup;
