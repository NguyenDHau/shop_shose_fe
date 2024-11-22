// import React, { useState } from 'react';
// import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// function InventoryDetailPopup() {
//     // Trạng thái để điều khiển mở/đóng popup
//     const [open, setOpen] = useState(false);

//     useEffect(() => {
//         const fetchSizes = async () => {
//             try {
//                 const accessToken = localStorage.getItem('accessToken');
//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     }
//                 };
//                 const response = await axios.get('http://localhost:8080/api/sizes', config);
//                 setSizes(response.data); // Giả sử API trả về một mảng các kích thước
//             } catch (error) {
//                 console.error('Lỗi khi gọi API:', error);
//             }
//         };
//         fetchSizes();
//     }, []);

//     const handleSizeSelectChange = (e) => {
//         setSelectedSizeId(e.target.value);
//     };

//     const handleSave = () => {
//         if (selectedSizeId) {
//             // Tạo object với dữ liệu đã chọn và gửi lên component cha
//             const data = {
//                 sizeId: Number(selectedSizeId)
//             };
//             onSave(data); // Gọi hàm onSave từ component cha
//             handleClose(); // Đóng popup
//         } else {
//             alert('Vui lòng chọn kích thước!');
//         }
//     };


//     // Dữ liệu inventory mẫu
//     const handleAddInventory = () => {
//         setInventory([...inventory, { sizeId: '', colorId: '', quantity: 0 }]);
//     };

//     const [inventory, setInventory] = useState([
//         { sizeId: 1, colorId: 1, quantity: 0 }
//     ]);

//     // Hàm mở popup
//     const handleClickOpen = () => {
//         setOpen(true);
//     };

//     // Hàm đóng popup
//     const handleClose = () => {
//         setOpen(false);
//     };

//     // Hàm xử lý thay đổi giá trị inventory
//     const handleInventoryChange = (index, field, value) => {
//         const newInventory = [...inventory];
//         newInventory[index][field] = value;
//         setInventory(newInventory);
//     };

//     // Hàm xóa một mục khỏi inventory
//     const handleRemoveInventory = (index) => {
//         const newInventory = inventory.filter((_, i) => i !== index);
//         setInventory(newInventory);
//     };


//     return (
//         <div>
//             <Button variant="outlined" onClick={handleClickOpen}>
//                 Mở Popup Inventory
//             </Button>
//             <Dialog open={open} onClose={handleClose}>
//                 <DialogTitle>{"Inventory Details"}</DialogTitle>
//                 <DialogContent>
//                     <DialogContentText>
//                         {inventory.map((item, index) => (
//                             <div key={index} className="input-group mb-3">
//                                 <span className="input-group-text" id={`size-addon-${index}`}>
//                                     Size ID:
//                                 </span>
//                                 <select
//                                     className="form-select"
//                                     value={item.sizeId}
//                                     onChange={(e) => handleInventoryChange(index, 'sizeId', e.target.value)}
//                                 >
//                                     <option value="">Chọn Size</option>
//                                     <option value="1">One</option>
//                                     <option value="2">Two</option>
//                                     <option value="3">Three</option>
//                                 </select>

//                                 <span className="input-group-text" id={`color-addon-${index}`}>
//                                     Color ID:
//                                 </span>
//                                 <select
//                                     className="form-select"
//                                     value={item.colorId}
//                                     onChange={(e) => handleInventoryChange(index, 'colorId', e.target.value)}
//                                 >
//                                     <option value="">Chọn Color</option>
//                                     <option value="1">One</option>
//                                     <option value="2">Two</option>
//                                     <option value="3">Three</option>
//                                 </select>

//                                 <span className="input-group-text" id={`quantity-addon-${index}`}>
//                                     Quantity:
//                                 </span>
//                                 <input
//                                     type="number"
//                                     className="form-control"
//                                     value={item.quantity}
//                                     onChange={(e) => handleInventoryChange(index, 'quantity', e.target.value)}
//                                 />
//                                 {/* Nút Xóa */}
//                                 <button
//                                     className="btn btn-danger btn-sm"
//                                     onClick={() => handleRemoveInventory(index)}
//                                     style={{ marginLeft: '10px' }}
//                                 >
//                                     Xóa
//                                 </button>
//                             </div>
//                         ))}
//                         {/* Nút Thêm Mục Inventory */}
//                         <Button variant="outlined" onClick={handleAddInventory} className="mt-2">
//                             Thêm
//                         </Button>
//                     </DialogContentText>
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose} color="primary">
//                         Đóng
//                     </Button>
//                     <Button onClick={handleClose} color="primary" autoFocus>
//                         Đồng ý
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//         </div>
//     );
// }

// export default InventoryDetailPopup;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

function ProductDetailPopup({ onSave }) {
    const [open, setOpen] = useState(false);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]); // State cho danh sách size
    const [selectedColorId, setSelectedColorId] = useState('');
    const [selectedSizeId, setSelectedSizeId] = useState(''); // State cho size được chọn
    const [image, setImage] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        // Gọi API để lấy danh sách màu
        const fetchColors = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                };
                const response = await axios.get('http://localhost:8080/api/colors', config);
                setColors(response.data);
            } catch (error) {
                console.error('Lỗi khi gọi API colors:', error);
            }
        };

        // Gọi API để lấy danh sách size
        const fetchSizes = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                };
                const response = await axios.get('http://localhost:8080/api/sizes', config);
                setSizes(response.data);
            } catch (error) {
                console.error('Lỗi khi gọi API sizes:', error);
            }
        };

        fetchColors();
        fetchSizes();
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setImage(null);
        setSelectedColorId('');
        setSelectedSizeId('');
        setFileUrl('');
        setQuantity('');
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'shoes_preset');

            try {
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/ddbtn5izu/image/upload`,
                    formData
                );
                setFileUrl(response.data.secure_url);
            } catch (error) {
                console.error('Lỗi khi tải lên hình ảnh:', error);
            }
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setFileUrl('');
    };

    const handleColorSelectChange = (e) => {
        setSelectedColorId(e.target.value);
    };

    const handleSizeSelectChange = (e) => {
        setSelectedSizeId(e.target.value);
    };

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleSave = () => {
        if (selectedColorId && selectedSizeId && fileUrl && quantity) {
            const data = {
                colorId: Number(selectedColorId),
                sizeId: Number(selectedSizeId),
                fileUrl: fileUrl,
                quantity: Number(quantity)
            };
            onSave(data);
            handleClose();
        } else {
            alert('Vui lòng chọn màu, kích thước, tải lên hình ảnh và nhập số lượng!');
        }
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Mở Popup
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Thông báo"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">Tên Màu:</span>
                            <select
                                className="form-select"
                                aria-label="Chọn màu"
                                onChange={handleColorSelectChange}
                                value={selectedColorId}
                            >
                                <option value="">Chọn tên màu</option>
                                {colors.map((color) => (
                                    <option key={color.id} value={color.id}>
                                        {color.colorName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon2">Kích Thước:</span>
                            <select
                                className="form-select"
                                aria-label="Chọn size"
                                onChange={handleSizeSelectChange}
                                value={selectedSizeId}
                            >
                                <option value="">Chọn kích thước</option>
                                {sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.sizeName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số Lượng:</label>
                            <input
                                type="number"
                                className="form-control"
                                value={quantity}
                                onChange={handleQuantityChange}
                                placeholder="Nhập số lượng"
                            />
                        </div>
                        <div className="container mt-4">
                            <div className="mb-3">
                                <label htmlFor="formFile" className="form-label">
                                    Chọn Ảnh
                                </label>
                                <input
                                    className="form-control"
                                    type="file"
                                    id="formFile"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {image && (
                                <div className="position-relative mt-3" style={{ display: 'inline-block' }}>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="Uploaded"
                                        className="img-fluid"
                                        style={{ maxWidth: '300px', height: 'auto' }}
                                    />
                                    <button
                                        onClick={handleRemoveImage}
                                        className="btn btn-danger btn-sm position-absolute"
                                        style={{
                                            top: '10px',
                                            right: '10px',
                                            borderRadius: '50%',
                                            padding: '5px 10px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                        </div>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Đóng
                    </Button>
                    <Button onClick={handleSave} color="primary" autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ProductDetailPopup;
