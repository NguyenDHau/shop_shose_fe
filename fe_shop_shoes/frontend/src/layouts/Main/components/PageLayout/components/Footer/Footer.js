import { Box } from '@mui/system'
import { Container, Grid, Typography, Link } from '@mui/material'
import { AppDownloadButton } from './components'

const Footer = () => {
  const footerData = [
    {
      columnTitle: 'Về chúng tôi',
      columnLinks: ['Cơ hội nghề nghiệp', 'Cửa hàng của chúng tôi', 'Chăm sóc khách hàng', 'Điều khoản & Điều kiện', 'Chính sách bảo mật'],
      sizing: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 2,
      },
      key: 1,
    },
    {
      columnTitle: 'Chăm sóc khách hàng',
      columnLinks: [
        'Trung tâm trợ giúp',
        'Hướng dẫn mua hàng',
        'Theo dõi đơn hàng',
        'Mua sỉ & Mua số lượng lớn',
        'Chính sách đổi trả & Hoàn tiền',
      ],
      sizing: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 3,
      },
      key: 2,
    },
    {
      columnTitle: 'Liên hệ với chúng tôi',
      columnLinks: [
        '178 Trần Đại Nghĩa, P. Hoà Hải, Q. Ngũ Hành Sơn, TP. Đà Nẵng',
        'Email: ndhau261102@gmail.com',
        'Điện thoại: 0906446132',
      ],
      sizing: {
        xs: 12,
        sm: 6,
        md: 6,
        lg: 3,
      },
      key: 3,
    },
  ];
  

  return (
    <Box component="footer" sx={{ bgcolor: '#222935', mt: 10 }}>
      <Container>
        <Grid container spacing={2} sx={{ py: 10 }}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box component="img" src="/images/logo.svg" alt="logo" sx={{ height: 50, mb: 2 }} />
              <Typography variant="subtitle" sx={{ color: (theme) => theme.palette.grey[500], mb: 2, fontSize: 15 }}>
              Nô Shoes - Mang đến phong cách thời thượng và chất lượng vượt trội. Chúng tôi tự hào cung cấp đa dạng các mẫu giày từ thể thao, công sở đến thời trang cao cấp, phù hợp với mọi phong cách và nhu cầu của bạn. Đồng hành cùng bạn trên mọi bước đi!
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
                <AppDownloadButton />
              </Box>
            </Box>
          </Grid>
          {footerData.map((data) => {
            return (
              <Grid item lg={data.sizing.lg} md={data.sizing.md} sm={data.sizing.sm} xs={data.sizing.xs} key={data.key}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ color: 'white', mb: 2, fontSize: 18, fontWeight: 700 }}>
                    {data.columnTitle}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {data.columnLinks.map((link) => {
                      return (
                        <Link href="#" sx={{ textDecoration: 'none' }} key={link}>
                          <Typography
                            sx={{
                              color: (theme) => theme.palette.grey[500],
                              '&:hover': { color: '#fff' },
                              mb: 1,
                              fontSize: 15,
                            }}
                            variant="subtitle1"
                          >
                            {link}
                          </Typography>
                        </Link>
                      )
                    })}
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
