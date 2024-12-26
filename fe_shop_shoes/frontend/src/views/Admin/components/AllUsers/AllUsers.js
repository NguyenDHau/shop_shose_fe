import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, TablePagination, TextField, Grid, Select, MenuItem, FormControl, InputLabel, Chip } from '@mui/material';
import axios from 'axios';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [filterAllowAccess, setFilterAllowAccess] = useState('');

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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredUsers = users.filter((user) => {
  const userName = user.username?.toLowerCase() || ''; // Đảm bảo userName luôn là chuỗi
  const phoneNumber = String(user.phoneNumber || '').toLowerCase(); // Ép thành chuỗi
  const allowAccess = user.allowAccess || '';

  return (
    userName.includes(searchName.toLowerCase()) &&
    phoneNumber.includes(searchPhone.toLowerCase()) &&
    (filterAllowAccess === '' || allowAccess === filterAllowAccess)
  );
});

  // Hàm xử lý thay đổi giá trị allowAccess
  const handleAllowAccessChange = async (userId, newAllowAccess) => {
    try {
      // Cập nhật trạng thái "allowAccess" trên giao diện
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, allowAccess: newAllowAccess } : user
      );
      setUsers(updatedUsers);

      // Lấy access token từ localStorage
      const accessToken = localStorage.getItem('accessToken') || '';

      // Gọi API để cập nhật trạng thái "allowAccess"
      await axios.put(
        `http://localhost:8080/api/auth/update-allow-access?id=${userId}&allowAccess=${newAllowAccess}`,
        {}, // body rỗng vì dữ liệu được truyền qua query parameters
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('AllowAccess updated successfully');
    } catch (error) {
      console.error('Error updating allowAccess:', error);
    }
  };


  return (
    <Box sx={{ p: 3, marginTop: 10 }}>
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
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="filter-allow-access-label">Lọc theo trạng thái tài khoản</InputLabel>
                <Select
                  labelId="filter-allow-access-label"
                  value={filterAllowAccess}
                  onChange={(e) => setFilterAllowAccess(e.target.value)}
                  label="Lọc theo Allow Access"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="Valid">Hợp lệ</MenuItem>
                  <MenuItem value="Unvalid">Tạm khoá</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Paper sx={{ boxShadow: 3, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Tên tài khoản</TableCell>
                    <TableCell>Họ tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Số diện thoại</TableCell>
                    <TableCell>Trạng thái tài khoản</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                    <TableRow key={user.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        <Avatar src={user.avatar || '/default-avatar.png'} alt="User Avatar" />
                      </TableCell>
                      <TableCell>{user.username || 'N/A'}</TableCell>
                      <TableCell>{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                      <TableCell align="center">
                        <Select
                          value={user.allowAccess || ''}
                          onChange={(e) => handleAllowAccessChange(user.id, e.target.value)}
                          variant="outlined"
                          size="small"
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="Unvalid">Tạm khoá</MenuItem>
                          <MenuItem value="Valid">Hợp lệ</MenuItem>
                        </Select>
                      </TableCell>
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
