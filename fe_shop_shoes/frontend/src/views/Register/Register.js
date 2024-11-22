import { Box, Button, Divider, Link, Paper, TextField, Typography } from '@mui/material'
import { useAuth } from 'core'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { PageURLs } from 'Routes'
import { Logo } from 'components'

const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const validationSchema = yup.object({
    username: yup.string('Enter your username').required('Username is required'),
    email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
    password: yup
      .string('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
    phoneNumber: yup.string('Enter your phone number').required('Phone number is required'),
    firstName: yup.string('Enter your first name').required('First name is required'),
    lastName: yup.string('Enter your last name').required('Last name is required'),
    address: yup.string('Enter your address').required('Address is required'),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref('password'), null], "Passwords don't match")
      .required('Password confirmation is required'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      address: '',
    },
    validationSchema,
    onSubmit: async ({ username, email, password, firstName, lastName, phoneNumber, address }) => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            role: ['user'], // Default role set to 'user'
            firstName,
            lastName,
            phoneNumber,
            address,
          }),
        })

        if (!response.ok) {
          throw new Error('Registration failed')
        }

        const data = await response.json()
        console.log('Registration successful:', data)

        navigate(PageURLs.Login)

        // You can redirect or handle success as needed
      } catch (error) {
        console.error('Error:', error)
        // Optionally handle errors and display messages to users
      }
    },
  })

  return (
    <Paper elevation={3} sx={{ p: 2, maxWidth: 400, width: '100%', mt: 5 }}>
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center" sx={{ mt: 1 }}>
        <Logo />
        <Typography variant="subtitle1" align="center" fontWeight="bold">
          Create Your Account
        </Typography>
      </Box>
      <Divider sx={{ my: 2 }} />
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          name="firstName"
          label="First Name"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          name="lastName"
          label="Last Name"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          name="passwordConfirmation"
          label="Confirm Password"
          type="password"
          value={formik.values.passwordConfirmation}
          onChange={formik.handleChange}
          error={formik.touched.passwordConfirmation && Boolean(formik.errors.passwordConfirmation)}
          helperText={formik.touched.passwordConfirmation && formik.errors.passwordConfirmation}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          name="phoneNumber"
          label="Phone Number"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          name="address"
          label="Address"
          value={formik.values.address}
          onChange={formik.handleChange}
          error={formik.touched.address && Boolean(formik.errors.address)}
          helperText={formik.touched.address && formik.errors.address}
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button color="primary" variant="contained" type="submit">
            Register
          </Button>
          <Link component={RouterLink} to={PageURLs.Login} variant="caption">
            Already have an account? Login!
          </Link>
        </Box>
      </form>
    </Paper>
  )
}

export default Register
