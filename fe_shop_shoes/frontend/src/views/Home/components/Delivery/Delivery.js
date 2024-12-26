import { Grid, Paper, Box, Typography, IconButton } from '@mui/material'
import React from 'react'
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import LockResetIcon from '@mui/icons-material/LockReset'
import theme from 'theme'

const deliveryDetails = [
  {
    id: 1,
    title: 'Giao hàng toàn quốc',
    subtitle: 'Đảm bảo là cửa hàng uy tín hàng đầu và được yêu thích nhất hiện nay tại Việt Nam.',
    icon: <AirportShuttleIcon />,
  },
  {
    id: 2,
    title: 'Thanh toán an toàn',
    subtitle: 'Đảm bảo là cửa hàng uy tín hàng đầu và được yêu thích nhất hiện nay tại Việt Nam.',
    icon: <PriceCheckIcon />,
  },
  {
    id: 3,
    title: 'Chính sách hoàn trả',
    subtitle: 'Đảm bảo là cửa hàng uy tín hàng đầu và được yêu thích nhất hiện nay tại Việt Nam.',
    icon: <LockResetIcon />,
  },
  {
    id: 4,
    title: 'Hỗ trợ 24/7',
    subtitle: 'Đảm bảo là cửa hàng uy tín hàng đầu và được yêu thích nhất hiện nay tại Việt Nam.',
    icon: <SupportAgentIcon />,
  },
]
const Delivery = () => {
  return (
    <Grid
      container
      spacing={3}
      sx={{
        mb: 1,
        columnSpacing: 3,
        direction: 'row',
        item: false,
        rowSpacing: 3,
        wrap: 'wrap',
      }}
    >
      {deliveryDetails.map((item) => (
        <Grid item xs={12} md={6} lg={3} key={item.id}>
          <Paper
            elevation={1}
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              cursor: 'pointer',
              p: 1,
              '&:hover': { boxShadow: 3 },
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: 2,
              }}
            >
              <IconButton sx={{ bgcolor: theme.palette.grey[200], height: 64, width: 64 }}>{item.icon}</IconButton>
              <Typography sx={{ fontWeight: 600, mb: 1, mt: 2, textAlign: 'center' }}>{item.title}</Typography>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1.25, mt: 2.5, textAlign: 'center', color: theme.palette.grey[500] }}
              >
                {item.subtitle}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default Delivery
