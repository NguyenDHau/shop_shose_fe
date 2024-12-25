import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Select, MenuItem, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import axios from 'axios';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);  // Hiển thị 5 dòng mỗi trang
    const [openDialog, setOpenDialog] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [filters, setFilters] = useState({
        status: '',
        statusPayment: '',
        phone: '',
        date: '',
        orderId: ''
    });
    const [selectedOrderNote, setSelectedOrderNote] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            const accessToken = localStorage.getItem('accessToken') || '';
            try {
                const response = await axios.get('http://localhost:8080/api/orders/all', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Hàm lọc đơn hàng dựa trên các filter
    const applyFilters = (order) => {
        const { status, statusPayment, phone, date, orderId } = filters;

        const statusMatch = status ? order.status === status : true;
        const statusPaymentMatch = statusPayment ? order.status_payment === statusPayment : true;
        const phoneMatch = phone ? order.cusPhone.includes(phone) : true;
        const dateMatch = date ? new Date(order.orderDate).toLocaleDateString('en-GB') === new Date(date).toLocaleDateString('en-GB') : true;
        const orderIdMatch = orderId ? order.id.toString().includes(orderId) : true;

        return statusMatch && statusPaymentMatch && phoneMatch && dateMatch && orderIdMatch;
    };

    const filteredOrders = orders.filter(applyFilters);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 5));
        setPage(0);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const updatedOrders = orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);

        try {
            const accessToken = localStorage.getItem('accessToken') || '';
            await axios.put(
                `http://localhost:8080/api/orders/${orderId}/status?status=${newStatus}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleStatusPaymentChange = async (orderId, newStatusPayment) => {
        const updatedOrders = orders.map((order) =>
            order.id === orderId ? { ...order, status_payment: newStatusPayment } : order
        );
        setOrders(updatedOrders);

        try {
            const accessToken = localStorage.getItem('accessToken') || '';
            await axios.put(
                `http://localhost:8080/api/orders/${orderId}/statusPayment?status_payment=${newStatusPayment}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const getStatusChipColor = (status) => {
        switch (status) {
            case 'Loading':
                return 'default';
            case 'Shipping':
                return 'primary';
            case 'Done':
                return 'success';
            default:
                return 'default';
        }
    };

    // Mở popup và tải chi tiết hóa đơn
    const handleRowClick = async (orderId) => {
        setSelectedOrderId(orderId);

        setOpenDialog(true);
        try {
            const accessToken = localStorage.getItem('accessToken') || '';
            const response = await axios.get(`http://localhost:8080/api/order-details/details/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            setOrderDetails(response.data);
            setSelectedOrderNote(response.data.orderNote || '');
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOrderDetails(null);
    };

    // Thay đổi filter giá trị
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    return (
        <Box sx={{ p: 3, marginTop: '100px', overflowY: 'auto' }}>
            {loading ? (
                <Typography align="center">Đang tải danh sách đơn hàng...</Typography>
            ) : (
                <Paper sx={{ boxShadow: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
                    <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Danh sách Đơn Hàng
                    </Typography>

                    {/* Bộ lọc */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                        <TextField
                            value={filters.orderId}
                            onChange={handleFilterChange}
                            name="orderId"
                            label="Lọc theo Order ID"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120 }}
                        />
                        <Select
                            value={filters.status}
                            onChange={handleFilterChange}
                            name="status"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">Tất cả trạng thái</MenuItem>
                            <MenuItem value="Loading">Loading</MenuItem>
                            <MenuItem value="Shipping">Shipping</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                        </Select>
                        <Select
                            value={filters.statusPayment}
                            onChange={handleFilterChange}
                            name="statusPayment"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">Tất cả thanh toán</MenuItem>
                            <MenuItem value="Loading">Loading</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                        </Select>
                        <TextField
                            value={filters.date}
                            onChange={handleFilterChange}
                            name="date"
                            label="Lọc theo ngày"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120 }}
                            type="date"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            value={filters.phone}
                            onChange={handleFilterChange}
                            name="phone"
                            label="Lọc theo số điện thoại"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120 }}
                        />
                    </Box>


                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Mã hoá đơn</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên khách hàng</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Email khách hàng</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số điện thoại</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Địa chỉ</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ngày mua hàng</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Trạng thái hoá đơn</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Thanh toán</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tổng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                                    <TableRow
                                        key={order.id}
                                        sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, cursor: 'pointer' }}
                                        onClick={() => handleRowClick(order.id)}
                                    >
                                        <TableCell align="center">{order.id}</TableCell>
                                        <TableCell align="center">{order.cusName || 'N/A'}</TableCell>
                                        <TableCell align="center">{order.cusEmail || 'N/A'}</TableCell>
                                        <TableCell align="center">{order.cusPhone || 'N/A'}</TableCell>
                                        <TableCell align="center">{order.shippingAddress || 'N/A'}</TableCell>
                                        <TableCell align="center">{formatDate(order.orderDate)}</TableCell>
                                        <TableCell align="center">
                                            <Select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ minWidth: 120 }}
                                            >
                                                <MenuItem
                                                    value="Loading"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Chip label="Loading" color={getStatusChipColor("Loading")} size="small" />
                                                </MenuItem>
                                                <MenuItem
                                                    value="Shipping"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Chip label="Shipping" color={getStatusChipColor("Shipping")} size="small" />
                                                </MenuItem>
                                                <MenuItem
                                                    value="Done"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Chip label="Done" color={getStatusChipColor("Done")} size="small" />
                                                </MenuItem>
                                            </Select>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Select
                                                value={order.status_payment}
                                                onChange={(e) => handleStatusPaymentChange(order.id, e.target.value)}
                                                variant="outlined"
                                                size="small"
                                                sx={{ minWidth: 120 }}
                                            >
                                                <MenuItem
                                                    value="Loading"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Chip label="Loading" color={getStatusChipColor("Loading")} size="small" />
                                                </MenuItem>
                                                <MenuItem
                                                    value="Done"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Chip label="Done" color={getStatusChipColor("Done")} size="small" />
                                                </MenuItem>
                                            </Select>
                                        </TableCell>

                                        <TableCell align="center">{order.toTal ? `${order.toTal.toLocaleString()} VND` : 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={filteredOrders.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}

            {/* Popup Chi tiết hóa đơn */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết Đơn Hàng #{selectedOrderId}</DialogTitle>
                <DialogTitle>Ghi chú: {selectedOrderNote}</DialogTitle>
                <DialogContent dividers>
                    {orderDetails ? (
                        <Box>
                            <Typography variant="h6" sx={{ mt: 2 }}>Order Details:</Typography>
                            {orderDetails.map((detail, index) => (
                                <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2, p: 1, border: '1px solid #ddd', borderRadius: '8px' }}>
                                    <img
                                        src={detail.fileUrl}
                                        alt={detail.productName}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }}
                                    />
                                    <Box>
                                        <Typography variant="body2"><strong>Product Name:</strong> {detail.productName}</Typography>
                                        <Typography variant="body2"><strong>Color:</strong> {detail.colorName}</Typography>
                                        <Typography variant="body2"><strong>Size:</strong> {detail.sizeName}</Typography>
                                        <Typography variant="body2"><strong>Quantity:</strong> {detail.quantity}</Typography>
                                        <Typography variant="body2"><strong>Price:</strong> {detail.price.toLocaleString()} VND</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body1">Loading...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AllOrders;
