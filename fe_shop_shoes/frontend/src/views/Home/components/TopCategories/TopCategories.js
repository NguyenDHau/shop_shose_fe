import { useEffect, useState } from 'react'
import { ArrowRight } from '@mui/icons-material'
import { Button, Card, CardActionArea, CardContent, CardMedia, Chip, Link, Paper, useTheme, Grid } from '@mui/material'
import { SliderArrow } from 'components'
import Headline from '../Headline'
import WidgetsIcon from '@mui/icons-material/Widgets'
import Slider from 'react-slick'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const TopCategories = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories')
        console.log("Fetched categories:", response.data) // Log dữ liệu ra console
        setCategories(response.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SliderArrow right />,
    prevArrow: <SliderArrow />,
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        settings: {
          slidesToShow: 2,
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
      {
        breakpoint: theme.breakpoints.values.xs,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  const handleCategoryClick = (categoryId) => {
    navigate(`/product-search`, { state: { categoryId } });
  };

  return (
    <>
      <Headline
        icon={<WidgetsIcon color="primary" />}
        sx={{ marginTop: 4 }}
      >
        Danh mục sản phẩm
      </Headline>
      <Slider {...settings} style={{ paddingTop: 8, paddingBottom: 8 }}>
        {categories.map((category) => (
          <Grid item xs={12} sm={12} md={2} lg={3} key={category.id}>
            <Card
              elevation={0}
              sx={{
                boxSizing: 'border-box',
                margin: 1,
              }}
            >
              <CardContent sx={{ pb: '16px !important' }}>
                <CardActionArea onClick={() => handleCategoryClick(category.id)}>
                  <Paper elevation={1} sx={{ overflow: 'hidden', position: 'relative' }}>
                    <Chip
                      color="secondary"
                      size="small"
                      sx={{ px: 0.5, position: 'absolute', top: 10, left: 10, fontWeight: 600 }}
                      label={category.name}
                    />
                    <CardMedia
                      component="img"
                      height="120"
                      image={category.categoryUrl}
                      alt={category.categoryName}
                    />
                  </Paper>
                </CardActionArea>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Slider>
    </>
  )
}

export default TopCategories
