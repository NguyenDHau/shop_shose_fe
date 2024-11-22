
import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, TextField, MenuItem, Button, Alert } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [revenueByDate, setRevenueByDate] = useState(null);
  const [revenueByMonth, setRevenueByMonth] = useState(null);
  const [revenueByYear, setRevenueByYear] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDate, setSelectedDate] = useState(dayjs()); // Ngày được chọn
  const [selectedMonth, setSelectedMonth] = useState(11); // Tháng được chọn
  const [selectedYear, setSelectedYear] = useState(2024); // Năm được chọn

  const fetchRevenueData = async () => {
    setLoading(true);
    setError(null); // Reset lỗi trước khi gọi API
    try {
      const accessToken = localStorage.getItem('accessToken') || '';

      // Gọi API doanh thu theo ngày
      // const date = selectedDate.format('YYYY-MM-DD');
      // const dateResponse = await axios.get(
      //   `http://localhost:8080/api/orders/revenue/date?date=${date}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${accessToken}`,
      //     },
      //   }
      // );
      // setRevenueByDate(dateResponse.data);

      // Gọi API doanh thu theo tháng
      const monthResponse = await axios.get(
        `http://localhost:8080/api/orders/revenue/month?year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRevenueByMonth(monthResponse.data);

      // Gọi API doanh thu theo năm
      const yearResponse = await axios.get(
        `http://localhost:8080/api/orders/revenue/year?year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRevenueByYear(yearResponse.data);
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setError('Failed to fetch revenue data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchRevenueData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Biểu đồ doanh thu theo ngày
  const chartDataDate = {
    labels: [selectedDate.format('YYYY-MM-DD')], // Hiển thị ngày
    datasets: [
      {
        label: 'Revenue',
        data: [revenueByDate?.sale || 0],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Orders',
        data: [revenueByDate?.countOrder || 0],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Biểu đồ doanh thu theo tháng
  const chartDataMonth = {
    labels: [`Month ${selectedMonth}, Year ${selectedYear}`], // Hiển thị tháng và năm
    datasets: [
      {
        label: 'Revenue',
        data: [revenueByMonth?.sale || 0],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Orders',
        data: [revenueByMonth?.countOrder || 0],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Biểu đồ doanh thu theo năm
  const chartDataYear = {
    labels: [`Year ${selectedYear}`], // Hiển thị năm
    datasets: [
      {
        label: 'Revenue',
        data: [revenueByYear?.sale || 0],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
      {
        label: 'Orders',
        data: [revenueByYear?.countOrder || 0],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }} align="center">
        Dashboard
      </Typography>
      {/* Bộ lọc */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          select
          label="Select Month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {[...Array(12).keys()].map((month) => (
            <MenuItem key={month + 1} value={month + 1}>
              {month + 1}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Select Year"
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        />
        <Button variant="contained" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Box>

      {/* Thông báo lỗi */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Biểu đồ doanh thu */}
      <Grid container spacing={3}>
        {/* Biểu đồ doanh thu theo ngày */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revenue ({selectedDate.format('YYYY-MM-DD')})
            </Typography>
            <Bar data={chartDataDate} options={{ responsive: true }} />
          </Paper>
        </Grid>

        {/* Biểu đồ doanh thu theo tháng */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revenue (Month: {selectedMonth}, Year: {selectedYear})
            </Typography>
            <Bar data={chartDataMonth} options={{ responsive: true }} />
          </Paper>
        </Grid>

        {/* Biểu đồ doanh thu theo năm */}
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Revenue (Year: {selectedYear})
            </Typography>
            <Bar data={chartDataYear} options={{ responsive: true }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;

