import { Grid, Box } from '@mui/material'

const CardDetails = ({ formik }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
          <img
            src="http://res.cloudinary.com/ddbtn5izu/image/upload/v1732704752/uvdwn8jrviwfwgmkv5ge.jpg"  // Đường dẫn đến mã QR trong thư mục images
            alt="QR Code"
            width="400px"
            height="600px"
          />
        </Box>
      </Grid>
    </Grid>
  )
}

export default CardDetails
