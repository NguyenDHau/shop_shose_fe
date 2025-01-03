import React from 'react'
import { Paper, Box, Typography, Button, Divider, TextField } from '@mui/material'
import { DisplayCurrency } from 'components'
import { useCart } from 'core'

const Subtotal = () => {
  const { totalPrice, cart } = useCart()
  const priceWithoutDiscount = cart
    .map((product) => +(product.price * product.quantity).toFixed(2))
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  return (
    <Paper sx={{ p: 4, mb: 2}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 14, color: (theme) => theme.palette.grey[500], mb: 1 }}>Giá gốc:</Typography>
        <Typography sx={{ fontSize: 19 }}>
          <DisplayCurrency number={priceWithoutDiscount} />
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 14, color: (theme) => theme.palette.grey[500], mb: 1 }}>Vận chuyển:</Typography>
        <Typography sx={{ fontSize: 19 }}>
          <DisplayCurrency number={0} />
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 14, color: (theme) => theme.palette.grey[500], mb: 1 }}>Phí:</Typography>
        <Typography sx={{ fontSize: 19 }}>
          <DisplayCurrency number={0} />
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ fontSize: 14, color: (theme) => theme.palette.grey[500], mb: 1 }}>Giảm giá</Typography>
        <Typography sx={{ fontSize: 19 }}>
          <DisplayCurrency number={priceWithoutDiscount} />
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box>
        <Typography
          sx={{
            fontSize: 23,
            fontWeight: 500,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
        >
          <DisplayCurrency number={totalPrice} />
        </Typography>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', mt: 3, mb: 2 }}>
            <TextField label="Mã giảm giá" name="voucher" size="small" fullWidth />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                width: '100%',
                border: `0.5px solid primary.main`,
                color: 'primary.main',
                p: 1,
                '&:hover': {
                  border: `0.5px solid primary.main`,
                  color: 'primary.main',
                  bgcolor: 'rgba(210, 63, 87, 0.04)',
                },
              }}
            >
              <Typography fontWeight={600} fontSize={14}>
                Áp dụng voucher
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}
export default Subtotal
