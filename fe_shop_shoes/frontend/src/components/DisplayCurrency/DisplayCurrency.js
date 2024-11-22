// const DisplayCurrency = ({ number }) => {
//   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
// }

// export default DisplayCurrency
const DisplayCurrency = ({ number }) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number)
}

export default DisplayCurrency
