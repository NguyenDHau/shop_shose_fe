import { Box, Button, Step, StepLabel, Stepper, Grid, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { PageLayout } from 'layouts/Main/components';
import { useState } from 'react';
import Cart from 'views/Cart';
import { useCart } from 'core';
import { validationSchemas } from './validationSchemas';
import { useSnackbar } from 'notistack';
import { PageURLs } from 'Routes';
import { useNavigate } from 'react-router-dom';
import { Shipping, Payment } from './components';
import axios from 'axios';

const Checkout = () => {
  const { cart, totalPrice, resetCart } = useCart();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);

  console.log("Cart:", cart);

  const formik = useFormik({
    initialValues: {
      address: {
        fullName: 'Nguyễn Duy Hậu',
        phone: '0906446132',
        email: 'ndhau261102@gmail.com',
        address1: '178,Trần Đại Nghĩa',
      },
      payment: {
        type: '',
        orderNote: '',
        card: {
          number: '',
          name: '',
          expiryDate: '',
          ccv: '',
        },
        details: 'Không',
      },
    },
    validationSchema: activeStep in validationSchemas ? validationSchemas[activeStep] : null,
    onSubmit: async (values) => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userId = localStorage.getItem('userId');
    
        const { data } = await axios.post(
          'http://localhost:8080/api/orders/create',
          {
            paymentMethod: values.payment.type,
            shippingAddress: values.address.address1,
            cusName: values.address.fullName,
            cusPhone: values.address.phone,
            cusEmail: values.address.email,
            orderNote: values.payment.orderNote,
            userId: userId,
            toTal: totalPrice,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
    
        const orderId = data.id;
    
        // Tạo order-details cho từng sản phẩm trong giỏ hàng
        await Promise.all(
          cart.map(item =>
            axios.post(
              'http://localhost:8080/api/order-details/create',
              {
                orderId,
                inventoryId: item.inventoryId,
                quantity: item.quantity,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            )
          )
        );
    
        resetCart();
        enqueueSnackbar('Đơn hàng đã được tạo thành công!', { variant: 'success' });
        navigate(`${PageURLs.Order}`);
      } catch (error) {
        console.error('Lỗi khi tạo đơn hàng:', error);
        enqueueSnackbar('Lỗi khi tạo đơn hàng', { variant: 'error' });
      }
    },
    
    
  });

  const steps = [
    { label: 'Giỏ hàng', component: <Cart withoutFooter={true} /> },
    { label: 'Vận chuyển', component: <Shipping formik={formik} /> },
    { label: 'Thanh toán', component: <Payment formik={formik} /> },
  ];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      formik.handleSubmit();
    } else if (formik.isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <PageLayout isAsync={false} container>
      {cart.length > 0 ? (
        <Grid container>
          <Grid item sm={12} display={{ sm: 'block', xs: 'none', m: 2 }}>
            <Stepper activeStep={activeStep} sx={{ px: 2 }}>
              {steps.map((step) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>{steps[activeStep].component}</Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Grid container spacing={2} sx={{ px: 3 }}>
              <Grid item sm={4} xs={12}>
                <Button fullWidth color="primary" disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                  {activeStep === 0 ? 'Quay lại' : `Quay lại ${steps[activeStep - 1].label}`}
                </Button>
              </Grid>
              <Grid item sm={4} xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleNext}
                  color="primary"
                  disabled={(activeStep !== 0 && !formik.isValid) || cart.length === 0}
                >
                  {activeStep === steps.length - 1 ? 'Đặt hàng' : `Tiếp tục đến ${steps[activeStep + 1].label}`}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Typography align="center" variant="subtitle1" fontWeight="bold">
          Bạn sẽ được chuyển hướng đến trang chính trong 5 giây
        </Typography>
      )}
    </PageLayout>
  );
};

export default Checkout;
