import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Container } from '@mui/system'
import { Pagination } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Grid, Typography, Box, Button } from '@mui/material'
import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'

const bannerSlide = (
  <SwiperSlide>
    <Grid
      container
      columnSpacing={3}
      spacing={3}
      direction="row"
      rowSpacing={3}
      alignItems="center"
      justifyContent="center"
      sx={{ my: 1 }}
    >
      <Grid item xs={12} sm={5}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h3" fontWeight={700} sx={{ height: '100%', width: '100%' }}>
            Chào mừng đến với Nô Shoes
          </Typography>
          <Typography sx={{ color: 'secondary.dark', fontSize: '0.875rem' }}>
            Chúng tôi có tất cả những thứ bạn cần. Với Nô Shoes, bạn sẽ có trải nghiệm tuyệt với nhất. 
          </Typography>
          <Button variant="contained" color="primary" sx={{ minWidth: 64, width: 154, height: 44 }}>
            Đi chợ thôi nào!
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} sm={5}>
        <Box
          alt="Nike black"
          component="img"
          src="http://res.cloudinary.com/ddbtn5izu/image/upload/v1732703110/ujueyez4sst3sus1rbq8.webp"
          sx={{ maxWidth: 530, width: '100%', maxheight: 400, height: '100%', ml: 2 }}
        />
      </Grid>
    </Grid>
  </SwiperSlide>
)

const Carousel = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <Container
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Swiper
          modules={[Pagination]}
          speed={800}
          slidesPerView={1}
          pagination={{ clickable: true, type: 'bullets' }}
          loop
        >
          {bannerSlide}
          {bannerSlide}
        </Swiper>
      </Container>
    </Box>
  )
}

export default Carousel
