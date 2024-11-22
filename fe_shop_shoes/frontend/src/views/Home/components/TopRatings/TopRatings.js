

// import { useEffect, useState } from 'react'
// import { Box, Button, CardActionArea, CardMedia, Grid, Link, Paper, Rating, Typography } from '@mui/material'
// import { DisplayCurrency } from 'components'
// import Headline from '../Headline'
// import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
// import { ArrowRight } from '@mui/icons-material'
// import axios from 'axios'

// const TopRatings = () => {
//   const [topRatingsDetails, setTopRatingsDetails] = useState([])

//   useEffect(() => {
//     const fetchTopRatedProducts = async () => {
//       console.log('Fetching top-rated products...')
//       try {
//         const token = localStorage.getItem('accessToken') // Lấy token từ localStorage
//         const response = await axios.get('http://localhost:8080/api/reviews/top-rated-products', {
//           headers: {
//             Authorization: `Bearer ${token}` // Thêm token vào header
//           }
//         })
        
//         const products = response.data.map((product) => ({
//           title: product.productName,
//           imgURL: product.fileUrl || '/images/default-product.webp',
//           price: product.price,
//           rating: product.avgRating || 4,
//           reviewCount: product.countReview || 0,
//         }))
//         setTopRatingsDetails(products)
//       } catch (error) {
//         console.error("Error fetching top-rated products:", error.response ? error.response.data : error.message)
//       }
//     }

//     fetchTopRatedProducts()
//   }, [])

//   return (
//     <>
//       <Headline
//         icon={<WorkspacePremiumIcon color="warning" />}
//         additionalComponent={
//           <Button
//             component={Link}
//             href="#"
//             sx={{ fontSize: 14, color: (theme) => theme.palette.grey[600] }}
//             endIcon={<ArrowRight />}
//           >
//             View all
//           </Button>
//         }
//       >
//         Top Ratings
//       </Headline>
//       <Paper sx={{ p: 2 }}>
//         <Grid container spacing={4} columnSpacing={4}>
//           {topRatingsDetails.map((item, i) => (
//             <Grid item xs={6} md={3} sm={6} key={i}>
//               <Box sx={{ m: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={i}>
//                 <CardActionArea sx={{ mb: 1.5 }}>
//                   <CardMedia
//                     component="img"
//                     image={item.imgURL}
//                     alt={item.title}
//                     sx={{ borderRadius: '8px', aspectRatio: '1 / 1' }}
//                   />
//                 </CardActionArea>
//                 <Box display="flex" alignItems="center">
//                   <Rating readOnly value={item.rating} sx={{ fontSize: '1.25rem' }} />
//                   <Typography fontSize={12} fontWeight={600}>
//                     ({item.reviewCount})
//                   </Typography>
//                 </Box>
//                 <Typography variant="h6" align="center" sx={{ fontSize: '14px !important', fontWeight: 600 }}>
//                   {item.title}
//                 </Typography>
//                 <Typography
//                   color="primary"
//                   variant="h6"
//                   align="center"
//                   sx={{ fontSize: '14px !important', fontWeight: 600 }}
//                 >
//                   <DisplayCurrency number={item.price} />
//                 </Typography>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Paper>
//     </>
//   )
// }

// export default TopRatings


import { useEffect, useState } from 'react'
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Paper, Rating, Typography } from '@mui/material'
import { DisplayCurrency } from 'components'
import Headline from '../Headline'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import { ArrowRight } from '@mui/icons-material'
import axios from 'axios'

const TopRatings = () => {
  const [topRatingsDetails, setTopRatingsDetails] = useState([])

  useEffect(() => {
    const fetchTopRatedProducts = async () => {
      console.log('Fetching top-rated products...')
      try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.get('http://localhost:8080/api/reviews/top-rated-products', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        const products = response.data.map((product) => ({
          title: product.productName,
          imgURL: product.fileUrl || '/images/default-product.webp',
          price: product.price,
          rating: product.avgRating || 4,
          reviewCount: product.countReview || 0,
        }))
        setTopRatingsDetails(products)
      } catch (error) {
        console.error("Error fetching top-rated products:", error.response ? error.response.data : error.message)
      }
    }

    fetchTopRatedProducts()
  }, [])

  return (
    <>
      <Headline
        icon={<WorkspacePremiumIcon color="warning" />}
        additionalComponent={
          <Button
            component={Link}
            href="#"
            sx={{ fontSize: 14, color: (theme) => theme.palette.grey[600] }}
            endIcon={<ArrowRight />}
          >
            View all
          </Button>
        }
      >
        Top Ratings
      </Headline>
      <Paper sx={{ p: 1.5 }}>
        <Grid container spacing={1.5}>
          {topRatingsDetails.map((item, i) => (
            <Grid item xs={6} md={3} sm={4} lg={2} key={i}>
              <Box sx={{ m: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }} key={i}>
                <CardActionArea sx={{ mb: 1 }}>
                  <CardMedia
                    component="img"
                    image={item.imgURL}
                    alt={item.title}
                    sx={{ borderRadius: '6px', width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                </CardActionArea>
                <Box display="flex" alignItems="center">
                  <Rating readOnly value={item.rating} sx={{ fontSize: '0.9rem' }} />
                  <Typography fontSize={11} fontWeight={500}>
                    ({item.reviewCount})
                  </Typography>
                </Box>
                <Typography variant="h6" align="center" sx={{ fontSize: '12px', fontWeight: 500 }}>
                  {item.title}
                </Typography>
                <Typography
                  color="primary"
                  variant="h6"
                  align="center"
                  sx={{ fontSize: '12px', fontWeight: 500 }}
                >
                  <DisplayCurrency number={item.price} />
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </>
  )
}

export default TopRatings
