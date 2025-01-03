import { Grid, useMediaQuery, Typography, Box, Link } from '@mui/material'
import { PageLayout } from 'layouts/Main/components'
import { CartProduct } from './components'
import { useLocation } from 'react-router-dom'
import { useCart } from 'core'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { ProductCard, Subtotal, SideMenu } from 'components'

const Cart = ({ withoutFooter }) => {
  const location = useLocation()
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const { cart, updateQuantity, removeProduct } = useCart()

  const handleIncrease = (product) => {
    const newQuantity = product.quantity + 1
    updateQuantity(product.id, newQuantity)
  }

  const handleDecrease = (product) => {
    const newQuantity = product.quantity - 1
    if (newQuantity > 0) {
      updateQuantity(product.id, newQuantity)
    } else {
      removeProduct(product.id)
    }
  }

  return (
    <PageLayout container isAsync={false} withoutFooter={withoutFooter}>
      {cart.length < 1 ? (
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" gap={2} height={450}>
          <Box component="img" src="/images/cart.png" alt="Cart" height={200} />
          <Typography align="center" variant="h4">
            Your cart is currently empty!
          </Typography>
          <Typography variant="subtitle1" color="gray" align="center">
            Looks like you have not made your choice yet. Browse our awesome store,
            <Link href="/">start shopping now</Link>!
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={8}>
            {cart.map((product) =>
              !isMobile ? (
                <CartProduct
                  key={product.id}
                  product={product}
                  handleIncrease={() => handleIncrease(product)}
                  handleDecrease={() => handleDecrease(product)}
                />
              ) : (
                <ProductCard
                  key={product.id}
                  product={product}
                  handleIncrease={() => handleIncrease(product)}
                  handleDecrease={() => handleDecrease(product)}
                />
              )
            )}
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            {location.pathname === '/cart' ? <SideMenu /> : <Subtotal />}
          </Grid>
        </Grid>
      )}
    </PageLayout>
  )
}

export default Cart
