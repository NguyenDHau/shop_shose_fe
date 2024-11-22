// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, TablePagination, TextField } from '@mui/material';
// import axios from 'axios';

// const AllUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchName, setSearchName] = useState('');
//   const [searchPhone, setSearchPhone] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const accessToken = localStorage.getItem('accessToken') || '';
//       try {
//         const response = await axios.get('http://localhost:8080/api/auth/users', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Error fetching users:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const getRoleColor = (roles) => {
//     switch (roles) {
//       case 'Admin':
//         return 'warning';
//       case 'Doctor':
//         return 'info';
//       case 'Staff':
//         return 'secondary';
//       case 'Customer':
//         return 'success';
//       default:
//         return 'default';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return isNaN(date.getTime()) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
//   };

//   // Hàm xử lý thay đổi trang
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   // Hàm xử lý thay đổi số hàng mỗi trang
//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Lọc người dùng theo tên và số điện thoại
//   const filteredUsers = users.filter((user) => {
//     const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
//     const phoneNumber = user.phoneNumber?.toLowerCase() || '';
//     return (
//       fullName.includes(searchName.toLowerCase()) &&
//       phoneNumber.includes(searchPhone.toLowerCase())
//     );
//   });

//   return (
//     <Box sx={{ p: 3, marginTop: '500px', overflowY: 'auto' }}>
//       {loading ? (
//         <Typography align="center">Đang tải danh sách người dùng...</Typography>
//       ) : (
//         <>
//           {/* Thêm các trường tìm kiếm */}
//           <Box sx={{ mb: 2 }}>
//             <TextField
//               label="Tìm kiếm theo tên"
//               variant="outlined"
//               fullWidth
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//               sx={{ mb: 2 }}
//             />
//             <TextField
//               label="Tìm kiếm theo số điện thoại"
//               variant="outlined"
//               fullWidth
//               value={searchPhone}
//               onChange={(e) => setSearchPhone(e.target.value)}
//             />
//           </Box>

//           <Paper sx={{ boxShadow: 'none', backgroundColor: 'transparent' }}>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>ID</TableCell>
//                     <TableCell>Avatar</TableCell>
//                     <TableCell>Full Name</TableCell>
//                     <TableCell>Email</TableCell>
//                     <TableCell>Phone Number</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
//                     <TableRow key={user.id}>
//                       <TableCell>{user.id}</TableCell>
//                       <TableCell>
//                         <Avatar src={user.avatarUrl || '/default-avatar.png'} alt="User Avatar" />
//                       </TableCell>
//                       <TableCell>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</TableCell>
//                       <TableCell>{user.email || 'N/A'}</TableCell>
//                       <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <TablePagination
//               rowsPerPageOptions={[5, 10, 20]}
//               component="div"
//               count={filteredUsers.length}
//               rowsPerPage={rowsPerPage}
//               page={page}
//               onPageChange={handleChangePage}
//               onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//           </Paper>
//         </>
//       )}
//     </Box>
//   );
// };

// export default AllUsers;

import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, TablePagination, TextField, Grid } from '@mui/material';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Đặt mặc định là 5 dòng mỗi trang
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const accessToken = localStorage.getItem('accessToken') || '';
      try {
        const response = await axios.get('http://localhost:8080/api/auth/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Hàm xử lý thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm xử lý thay đổi số hàng mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Lọc người dùng theo tên và số điện thoại
  const filteredUsers = users.filter((user) => {
    const userName = user.username?.toLowerCase() || '';
    const phoneNumber = user.phoneNumber?.toLowerCase() || '';
    return (
      userName.includes(searchName.toLowerCase()) &&
      phoneNumber.includes(searchPhone.toLowerCase())
    );
  });

  return (
    <Box sx={{ p: 3, marginTop: 3 }}>
      {loading ? (
        <Typography align="center">Đang tải danh sách người dùng...</Typography>
      ) : (
        <>
          {/* Bộ lọc tìm kiếm */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tìm kiếm theo tên"
                variant="outlined"
                fullWidth
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tìm kiếm theo số điện thoại"
                variant="outlined"
                fullWidth
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
              />
            </Grid>
          </Grid>

          <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Username</TableCell> {/* Thêm cột Username */}
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow key={user.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Avatar src={user.avatarUrl || '/default-avatar.png'} alt="User Avatar" />
                      </TableCell>
                      <TableCell>{user.username || 'N/A'}</TableCell> {/* Hiển thị Username */}
                      <TableCell>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default AllUsers;
