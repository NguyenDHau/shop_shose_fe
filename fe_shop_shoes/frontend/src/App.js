import { BrowserRouter } from 'react-router-dom'
import Routes from 'Routes'
import { Store } from 'core'
import { CssBaseline } from '@mui/material'
import { InitialScrollToTop } from 'components'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BrowserRouter>
      <Store>
        <InitialScrollToTop />
        <CssBaseline />
        <Routes />
        <ToastContainer />
      </Store>
    </BrowserRouter>
  )
}

export default App
