
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, TextField } from '@mui/material';
// import { PageLayout } from 'layouts/Main/components';

// const Order = () => {
//   const [orderData, setOrderData] = useState(null);
//   const [error, setError] = useState(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [selectedOrderId, setSelectedOrderId] = useState(null);
//   const [filters, setFilters] = useState({
//     status: '',
//     statusPayment: '',
//     phone: '',
//     date: '',
//     orderId: ''
//   });
//   const [page, setPage] = useState(0); // Khai báo và sử dụng state cho page
//   const [rowsPerPage, setRowsPerPage] = useState(5); // Khai báo và sử dụng state cho rowsPerPage

//   const userId = localStorage.getItem('userId');
//   const token = localStorage.getItem('accessToken');

//   useEffect(() => {
//     const fetchOrderData = async () => {
//       try {
//         const orderResponse = await axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setOrderData(orderResponse.data);
//       } catch (err) {
//         setError(err);
//       }
//     };

//     fetchOrderData();
//   }, [userId, token]);

//   // Hàm lọc đơn hàng dựa trên các filter
//   const applyFilters = (order) => {
//     const { status, statusPayment, phone, date, orderId } = filters;

//     const statusMatch = status ? order.status === status : true;
//     const statusPaymentMatch = statusPayment ? order.status_payment === statusPayment : true;
//     const phoneMatch = phone ? order.cusPhone.includes(phone) : true;
//     const dateMatch = date ? new Date(order.orderDate).toLocaleDateString('en-GB') === new Date(date).toLocaleDateString('en-GB') : true;
//     const orderIdMatch = orderId ? order.id.toString().includes(orderId) : true;

//     return statusMatch && statusPaymentMatch && phoneMatch && dateMatch && orderIdMatch;
//   };

//   const filteredOrders = orderData ? orderData.filter(applyFilters) : [];

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
//   };

//   const handleChangeFilter = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage); // Sử dụng setPage để thay đổi trang
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 5)); // Sử dụng setRowsPerPage để thay đổi số dòng mỗi trang
//     setPage(0);
//   };

//   const handleRowClick = async (orderId) => {
//     setSelectedOrderId(orderId);
//     setOpenDialog(true);
//     try {
//       const response = await axios.get(`http://localhost:8080/api/order-details/details/${orderId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       setOrderDetails(response.data);
//     } catch (error) {
//       console.error('Error fetching order details:', error);
//     }
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setOrderDetails(null);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Shipping':
//         return '#2196F3'; // Blue
//       case 'Loading':
//         return '#f44336'; // Red
//       case 'Done':
//         return '#4caf50'; // Green
//       default:
//         return '#000000'; // Default black
//     }
//   };

//   if (error) {
//     return <div>Error fetching orders: {error.message}</div>;
//   }

//   if (!orderData) {
//     return (
//       <PageLayout container isAsync={false}>
//         <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2} height={450}>
//           <Typography variant="h4">Loading your orders...</Typography>
//         </Box>
//       </PageLayout>
//     );
//   }

//   if (orderData.length === 0) {
//     return (
//       <PageLayout container isAsync={false}>
//         <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2} height={450}>
//           <Typography variant="h4">You have no orders yet!</Typography>
//           <Typography variant="subtitle1" color="gray" align="center">
//             Looks like you haven’t made any orders yet. Browse our store and start shopping!
//           </Typography>
//         </Box>
//       </PageLayout>
//     );
//   }

//   return (
//     <PageLayout container isAsync={false}>
//       <Box padding={3}>
//         <Typography variant="h4" gutterBottom color="primary">
//           Lịch sử mua hàng
//         </Typography>

//         {/* Bộ lọc */}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
//           <TextField
//             value={filters.orderId}
//             onChange={handleChangeFilter}
//             name="orderId"
//             label="Lọc theo Order ID"
//             variant="outlined"
//             size="small"
//             sx={{ minWidth: 160 }}
//           />
//           <Select
//             value={filters.status}
//             onChange={handleChangeFilter}
//             name="status"
//             label="Trạng thái"
//             variant="outlined"
//             size="small"
//             sx={{ minWidth: 160 }}
//           >
//             <MenuItem value="">Tất cả trạng thái</MenuItem>
//             <MenuItem value="Loading">Loading</MenuItem>
//             <MenuItem value="Shipping">Shipping</MenuItem>
//             <MenuItem value="Done">Done</MenuItem>
//           </Select>
//           <TextField
//             value={filters.date}
//             onChange={handleChangeFilter}
//             name="date"
//             label="Lọc theo ngày"
//             variant="outlined"
//             size="small"
//             sx={{ minWidth: 160 }}
//             type="date"
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//           <TextField
//             value={filters.phone}
//             onChange={handleChangeFilter}
//             name="phone"
//             label="Lọc theo số điện thoại"
//             variant="outlined"
//             size="small"
//             sx={{ minWidth: 160 }}
//           />
//         </Box>

//         <TableContainer sx={{ width: '100%' }}>
//           <Table>
//             <TableHead style={{ backgroundColor: '#f4f4f4' }}>
//               <TableRow>
//                 <TableCell><strong>Mã đơn hàng</strong></TableCell>
//                 <TableCell><strong>Trạng thái</strong></TableCell>
//                 <TableCell><strong>Phương thức thanh toán</strong></TableCell>
//                 <TableCell><strong>Địa chỉ giao hàng</strong></TableCell>
//                 <TableCell><strong>Ngày tạo đơn hàng</strong></TableCell>
//                 <TableCell><strong>Người đặt hàng</strong></TableCell>
//                 <TableCell><strong>Số điện thoại</strong></TableCell>
//                 <TableCell><strong>Tổng tiền (VND)</strong></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredOrders.map((order, index) => (
//                 <TableRow
//                   key={order.id}
//                   style={{
//                     backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
//                     cursor: 'pointer',
//                   }}
//                   hover
//                   onClick={() => handleRowClick(order.id)}
//                 >
//                   <TableCell>{order.id}</TableCell>
//                   <TableCell style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
//                     {order.status}
//                   </TableCell>
//                   <TableCell>{order.paymentMethod}</TableCell>
//                   <TableCell>{order.shippingAddress}</TableCell>
//                   <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
//                   <TableCell>{order.cusName}</TableCell>
//                   <TableCell>{order.cusPhone}</TableCell>
//                   <TableCell>{order.toTal.toLocaleString()}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>

//       {/* Order Details Dialog */}
//       <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
//         <DialogTitle>Chi tiết Đơn Hàng #{selectedOrderId}</DialogTitle>
//         <DialogContent dividers>
//           {orderDetails ? (
//             <Box>
//               <Typography variant="h6" sx={{ mt: 2 }}>Order Details:</Typography>
//               {orderDetails.map((detail, index) => (
//                 <Box key={index} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mb: 2, p: 1, border: '1px solid #ddd', borderRadius: '8px' }}>
//                   <img
//                     src={detail.fileUrl}
//                     alt={detail.productName}
//                     style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }}
//                   />
//                   <Box>
//                     <Typography variant="body2"><strong>Product Name:</strong> {detail.productName}</Typography>
//                     <Typography variant="body2"><strong>Color:</strong> {detail.colorName}</Typography>
//                     <Typography variant="body2"><strong>Size:</strong> {detail.sizeName}</Typography>
//                     <Typography variant="body2"><strong>Quantity:</strong> {detail.quantity}</Typography>
//                     <Typography variant="body2"><strong>Price:</strong> {detail.price.toLocaleString()} VND</Typography>
//                   </Box>
//                 </Box>
//               ))}
//             </Box>
//           ) : (
//             <Typography variant="body1">Loading...</Typography>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} variant="contained" color="primary">
//             Close
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </PageLayout>
//   );
// };

// export default Order;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, Box, Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, MenuItem, TextField, TablePagination } from '@mui/material';
import { PageLayout } from 'layouts/Main/components';

const Order = () => {
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);
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
  const [page, setPage] = useState(0); // Khai báo và sử dụng state cho page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Khai báo và sử dụng state cho rowsPerPage

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const orderResponse = await axios.get(`http://localhost:8080/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrderData(orderResponse.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchOrderData();
  }, [userId, token]);

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

  const filteredOrders = orderData ? orderData.filter(applyFilters) : [];

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
  };

  const handleChangeFilter = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage); // Sử dụng setPage để thay đổi trang
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5)); // Sử dụng setRowsPerPage để thay đổi số dòng mỗi trang
    setPage(0);
  };

  const handleRowClick = async (orderId) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/order-details/details/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setOrderDetails(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Loading':
        return '#2196F3'; // Blue
      case 'Shipping':
        return '#f44336'; // Red
      case 'Done':
        return '#4caf50'; // Green
      default:
        return '#000000'; // Default black
    }
  };

  if (error) {
    return <div>Error fetching orders: {error.message}</div>;
  }

  if (!orderData) {
    return (
      <PageLayout container isAsync={false}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2} height={450}>
          <Typography variant="h4">Loading your orders...</Typography>
        </Box>
      </PageLayout>
    );
  }

  if (orderData.length === 0) {
    return (
      <PageLayout container isAsync={false}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2} height={450}>
          <Typography variant="h4">You have no orders yet!</Typography>
          <Typography variant="subtitle1" color="gray" align="center">
            Looks like you haven’t made any orders yet. Browse our store and start shopping!
          </Typography>
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout container isAsync={false}>
      <Box padding={3}>
        <Typography variant="h4" gutterBottom color="primary">
          Lịch sử mua hàng
        </Typography>

        {/* Bộ lọc */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mb: 2 }}>
          <TextField
            value={filters.orderId}
            onChange={handleChangeFilter}
            name="orderId"
            label="Lọc theo Order ID"
            variant="outlined"
            size="small"
            sx={{ minWidth: 160 }}
          />
          <Select
            value={filters.status}
            onChange={handleChangeFilter}
            name="status"
            label="Trạng thái"
            variant="outlined"
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">Tất cả trạng thái</MenuItem>
            <MenuItem value="Loading">Loading</MenuItem>
            <MenuItem value="Shipping">Shipping</MenuItem>
            <MenuItem value="Done">Done</MenuItem>
          </Select>
          <TextField
            value={filters.date}
            onChange={handleChangeFilter}
            name="date"
            label="Lọc theo ngày"
            variant="outlined"
            size="small"
            sx={{ minWidth: 160 }}
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            value={filters.phone}
            onChange={handleChangeFilter}
            name="phone"
            label="Lọc theo số điện thoại"
            variant="outlined"
            size="small"
            sx={{ minWidth: 160 }}
          />
        </Box>

        <TableContainer sx={{ width: '100%' }}>
          <Table>
            <TableHead style={{ backgroundColor: '#f4f4f4' }}>
              <TableRow>
                <TableCell><strong>Mã đơn hàng</strong></TableCell>
                <TableCell><strong>Trạng thái</strong></TableCell>
                <TableCell><strong>Phương thức thanh toán</strong></TableCell>
                <TableCell><strong>Địa chỉ giao hàng</strong></TableCell>
                <TableCell><strong>Ngày tạo đơn hàng</strong></TableCell>
                <TableCell><strong>Người đặt hàng</strong></TableCell>
                <TableCell><strong>Số điện thoại</strong></TableCell>
                <TableCell><strong>Tổng tiền (VND)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order, index) => (
                <TableRow
                  key={order.id}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#ffffff',
                    cursor: 'pointer',
                  }}
                  hover
                  onClick={() => handleRowClick(order.id)}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell style={{ color: getStatusColor(order.status), fontWeight: 'bold' }}>
                    {order.status}
                  </TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{order.shippingAddress}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                  <TableCell>{order.cusName}</TableCell>
                  <TableCell>{order.cusPhone}</TableCell>
                  <TableCell>{order.toTal.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Order Details Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Chi tiết Đơn Hàng #{selectedOrderId}</DialogTitle>
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
    </PageLayout>
  );
};

export default Order;
