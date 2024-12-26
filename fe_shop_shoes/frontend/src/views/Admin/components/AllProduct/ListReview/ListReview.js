import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TablePagination, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Avatar
} from '@mui/material';
import axios from 'axios';

const ListReview = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [filters, setFilters] = useState({
        productName: '',
        userName: '',
        start: ''
    });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken'); // Get token from local storage

                const response = await axios.get('http://localhost:8080/api/reviews/admin-review', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': accessToken ? `Bearer ${accessToken}` : '', // Include token in Authorization header if available
                    },
                });
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Apply filters
    const applyFilters = (review) => {
        const { productName, userName, start } = filters;

        const productNameMatch = productName ? review.productName.toLowerCase().includes(productName.toLowerCase()) : true;
        const userNameMatch = userName ? review.userName.toLowerCase().includes(userName.toLowerCase()) : true;
        const startMatch = start ? review.start === parseInt(start) : true;

        return productNameMatch && userNameMatch && startMatch;
    };

    const filteredReviews = reviews.filter(applyFilters);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleRowClick = (review) => {
        setSelectedReview(review);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedReview(null);
    };

    return (
        <Box sx={{ p: 3, marginTop: '100px', overflowY: 'auto' }}>
            {loading ? (
                <Typography align="center">Đang tải danh sách đánh giá...</Typography>
            ) : (
                <Paper sx={{ boxShadow: 3, backgroundColor: 'white', p: 2, borderRadius: 2 }}>
                    <Typography variant="h5" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
                        Danh sách Đánh Giá
                    </Typography>

                    {/* Filters */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                        <TextField
                            value={filters.productName}
                            onChange={handleFilterChange}
                            name="productName"
                            label="Lọc theo tên sản phẩm"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 180 }}
                        />
                        <TextField
                            value={filters.userName}
                            onChange={handleFilterChange}
                            name="userName"
                            label="Lọc theo tên người dùng"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 180 }}
                        />
                        <Select
                            value={filters.start}
                            onChange={handleFilterChange}
                            name="start"
                            variant="outlined"
                            size="small"
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">Tất cả đánh giá</MenuItem>
                            <MenuItem value="1">1 Sao</MenuItem>
                            <MenuItem value="2">2 Sao</MenuItem>
                            <MenuItem value="3">3 Sao</MenuItem>
                            <MenuItem value="4">4 Sao</MenuItem>
                            <MenuItem value="5">5 Sao</MenuItem>
                        </Select>
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Avatar</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên sản phẩm</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Tên người dùng</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Đánh giá</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Số sao</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReviews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((review) => (
                                    <TableRow
                                        key={review.reviewId}
                                        sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' }, cursor: 'pointer' }}
                                        onClick={() => handleRowClick(review)}
                                    >
                                        <TableCell>
                                            <Avatar src={review.avatar || '/default-avatar.png'} alt="User Avatar" />
                                        </TableCell>
                                        <TableCell align="center">{review.productName || 'N/A'}</TableCell>
                                        <TableCell align="center">{review.userName || 'N/A'}</TableCell>
                                        <TableCell align="center">{review.review || 'N/A'}</TableCell>
                                        <TableCell align="center">{review.start || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 20]}
                        component="div"
                        count={filteredReviews.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}

            {/* Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Chi tiết Đánh Giá</DialogTitle>
                <DialogContent dividers>
                    {selectedReview ? (
                        <Box>
                            <Typography variant="body1"><strong>Sản phẩm:</strong> {selectedReview.productName}</Typography>
                            <Typography variant="body1"><strong>Người dùng:</strong> {selectedReview.userName}</Typography>
                            <Typography variant="body1"><strong>Đánh giá:</strong> {selectedReview.review}</Typography>
                            <Typography variant="body1"><strong>Số sao:</strong> {selectedReview.start}</Typography>
                        </Box>
                    ) : (
                        <Typography>Đang tải...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary">Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ListReview;
