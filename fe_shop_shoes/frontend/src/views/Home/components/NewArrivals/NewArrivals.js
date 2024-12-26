import { useEffect, useState } from 'react'
import { ArrowRight } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardContent, CardMedia, Chip, Link, Paper, useTheme } from '@mui/material'
import { SliderArrow } from 'components'
import Headline from '../Headline'
import NewReleasesIcon from '@mui/icons-material/NewReleases'
import Slider from 'react-slick'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const NewArrivals = () => {
  const theme = useTheme()
  const [branches, setBranches] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/branches')
        console.log("Fetched branches:", response.data)
        setBranches(response.data)
      } catch (error) {
        console.error("Error fetching branches:", error)
      }
    }

    fetchBranches()
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Hiển thị nhiều hơn để thu nhỏ khoảng cách
    slidesToScroll: 1,
    nextArrow: <SliderArrow right />,
    prevArrow: <SliderArrow />,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: theme.breakpoints.values.md,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: theme.breakpoints.values.sm,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const handleCategoryClick = (branchId) => {
    navigate(`/product-search`, { state: { branchId } });
  };

  return (
    <>
      <Headline
        icon={<NewReleasesIcon color="success" />}
        sx={{ marginTop: 4 }}
      >
        Thương hiệu
      </Headline>
      <Slider {...settings} style={{ padding: '0 8px' }}> {/* Giảm padding của Slider */}
        {branches.map((branch) => (
          <div key={branch.id} style={{ padding: '4px' }}> {/* Giảm padding của từng phần tử */}
            <Card
              elevation={0}
              sx={{
                boxSizing: 'border-box',
                borderRadius: '12px', // Bo góc nhẹ cho card
                overflow: 'hidden', // Ẩn phần tràn của ảnh
                margin: '0 auto', // Căn giữa card
              }}
            >
              <CardActionArea onClick={() => handleCategoryClick(branch.id)}>
                <Paper elevation={1} sx={{ overflow: 'hidden', position: 'relative', borderRadius: '12px' }}>
                  <Chip
                    color="secondary"
                    size="small"
                    sx={{ px: 0.5, position: 'absolute', top: 10, left: 10, fontWeight: 600 }}
                    label={branch.branchName}
                  />
                  <CardMedia
                    component="img"
                    image={branch.branchUrl || '/images/default-product.webp'}
                    alt={branch.branchName}
                    sx={{
                      width: '100%', // Chiều rộng 100% để ảnh cân đối trong card
                      height: 'auto', // Giữ nguyên tỉ lệ ảnh và cho phép hiển thị tối đa kích thước
                      objectFit: 'contain', // Đảm bảo ảnh không bị cắt
                    }}
                  />
                </Paper>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </Slider>
    </>
  )
}

export default NewArrivals
