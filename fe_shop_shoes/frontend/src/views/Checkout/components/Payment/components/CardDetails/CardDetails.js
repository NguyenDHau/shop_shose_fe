import { Grid, Box } from '@mui/material'

const CardDetails = ({ formik }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src="/frontend/build/images/qrCode.png"  // Đường dẫn đến mã QR trong thư mục images
            alt="QR Code"
            width="200px"
            height="200px"
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default CardDetails
