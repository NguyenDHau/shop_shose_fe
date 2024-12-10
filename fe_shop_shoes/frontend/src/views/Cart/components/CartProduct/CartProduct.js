import React from 'react'
import { Box, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { Close } from '@mui/icons-material'
import { DisplayCurrency } from 'components'
import { useCart } from 'core'

const CartProduct = ({ product }) => {
  const { updateQuantity, removeProduct, getFinalPrice } = useCart()
  const { cart } = useCart();

  const handleIncrease = () => {
    const newQuantity = product.quantity + 1
    updateQuantity(product.id, newQuantity, product.inventoryId)
  }

  const handleDecrease = () => {
    const newQuantity = product.quantity - 1
    if (newQuantity > 0) {
      updateQuantity(product.id, newQuantity, product.inventoryId)
    } else {
      removeProduct(product.id)
    }
  }

  console.log('Product Details:', product); // Log the product object

  return (
    <Card sx={{ display: 'flex', height: 140, mb: 3, position: 'relative' }}>
      <CardMedia component="img" sx={{ width: 100 }} image={product.fileUrl} alt={product.productName} />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h6">{product.productName}</Typography>
        <Typography variant="body2" color="text.secondary">
          Color: {product.colorName} - Size: {product.sizeName}
        </Typography>
        <Typography variant="body2">
          Price: <DisplayCurrency number={getFinalPrice(product)} />
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <IconButton onClick={handleDecrease}>
            <RemoveIcon />
          </IconButton>
          <Typography variant="h6">{product.quantity}</Typography>
          <IconButton onClick={handleIncrease}>
            <AddIcon />
          </IconButton>
        </Box>
        <Typography variant="overline">
          <DisplayCurrency number={product.price} /> x {product.quantity} ={' '}
          <DisplayCurrency number={getFinalPrice(product) * product.quantity} />
        </Typography>
      </CardContent>
      <IconButton
        size="small"
        sx={{ position: 'absolute', top: 0, right: 0 }}
        onClick={() => removeProduct(product.id)}
      >
        <Close />
      </IconButton>
    </Card>
  )
}

export default CartProduct
