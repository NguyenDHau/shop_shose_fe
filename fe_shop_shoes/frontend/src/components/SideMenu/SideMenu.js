import { Box, Button, Typography, Paper, TextField, Divider, MenuItem, Select, FormControl } from '@mui/material'
import { useState } from 'react'
import { DisplayCurrency } from 'components'
import { useCart } from 'core'
import { Link } from 'react-router-dom'

const SideMenu = () => {
  const { totalPrice } = useCart()
  const [country, setCountry] = useState('Bulgaria')
  const selectOptions = ['Bulgaria', 'Spain', 'Germany']

  const handleChange = (event) => {
    setCountry(event.target.value)
  }
  return (
    <Box>
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography sx={{ fontSize: 14, color: (theme) => theme.palette.grey[500] }}>Total:</Typography>
          </Box>
          <Box>
            <Typography sx={{ textAlign: 'center', p: 1, fontSize: 16, fontWeight: 600 }}>
              <DisplayCurrency number={totalPrice} />
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <Divider sx={{ width: '100%' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', my: 2 }}>
          <Divider sx={{ width: '100%' }} />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', mb: 1 }}>
            <TextField label="Voucher" name="voucher" size="small" fullWidth />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              sx={{
                p: 1,
              }}
            >
              <Typography fontWeight={600} fontSize={14}>
                Apply Voucher
              </Typography>
            </Button>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center', my: 3 }}>
          <Divider sx={{ width: '100%' }} />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',
            my: 1,
          }}
        >
          
          <Box>
            <Link to="/checkout" style={{ textDecoration: 'none', color: '#fff' }}>
              <Button fullWidth variant="contained" color="primary" sx={{ height: 40 }}>
                <Typography fontWeight={600} fontSize={14}>
                  Checkout Now
                </Typography>
              </Button>
            </Link>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}></Box>
      </Paper>
    </Box>
  )
}

export default SideMenu
