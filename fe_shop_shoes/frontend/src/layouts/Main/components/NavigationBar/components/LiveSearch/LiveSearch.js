// import { useState, useEffect } from 'react'
// import { Box, InputAdornment, Stack, TextField, Autocomplete } from '@mui/material'
// import SearchIcon from '@mui/icons-material/Search'
// import { useNavigate } from 'react-router-dom'
// import { API_URL } from 'config'
// import axios from 'axios'
// import { useError } from 'utils/hooks'

// const LiveSearch = ({ toggleDrawer, setState }) => {
//   const { setError } = useError()
//   const [open, setOpen] = useState(false)
//   const [inputValue, setInputValue] = useState('')
//   const [jsonResults, setJsonResults] = useState([])
//   const navigate = useNavigate()

//   useEffect(() => {
//     const accessToken = localStorage.getItem('accessToken');
    
//     const fetchProducts = async () => {
//       try {
//         const res = await axios.get(`${API_URL}/products?page=1&productsPerPage=30`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setJsonResults(res?.data?.result);
//       } catch (error) {
//         setError(error);
//       }
//     };

//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const onKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       const product = jsonResults.filter(
//         (element) => element.title.toLowerCase().trim() === e.target.value.toLowerCase().trim()
//       )[0]
//       if (product) {
//         navigate(`/products/${product?._id}`)
//       }
//       setOpen(false)
//       setInputValue('')
//       if (setState && toggleDrawer) {
//         setState(false)
//         toggleDrawer()(false)
//       }
//     }
//   }

//   const handleClick = (id) => {
//     navigate(`products/${id}`)
//     setOpen(false)
//     setInputValue('')
//     if (setState && toggleDrawer) {
//       setState(false)
//       toggleDrawer()(false)
//     }
//   }

//   return (
//     <Stack
//       spacing={2}
//       sx={{
//         flex: '1 1 0',
//         maxWidth: '670px',
//         mx: 'auto',
//       }}
//     >
//       <Autocomplete
//         freeSolo
//         open={open}
//         onOpen={() => {
//           if (inputValue) {
//             setOpen(true)
//           }
//         }}
//         onClose={() => setOpen(false)}
//         inputValue={inputValue}
//         onInputChange={(e, value) => {
//           setInputValue(value)

//           if (!value) {
//             setOpen(false)
//           }
//         }}
//         disableClearable
//         id="free-solo-live-search"
//         getOptionLabel={(jsonResults) =>
//           jsonResults?.title?.toLowerCase().trim() ? `${jsonResults?.title.toLowerCase().trim()}` : ''
//         }
//         options={jsonResults}
//         isOptionEqualToValue={(option, value) => option?.title === value.title}
//         renderOption={(props, jsonResults) => {
//           return (
//             <Box component="li" {...props} key={jsonResults?._id} onClick={() => handleClick(jsonResults?._id)}>
//               {jsonResults?.title}
//             </Box>
//           )
//         }}
//         renderInput={(params) => (
//           <TextField
//             fullWidth
//             onKeyPress={onKeyPress}
//             placeholder="Searching for..."
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderRadius: 10,
//                 },
//               },
//             }}
//             {...params}
//             InputProps={{
//               size: 'small',
//               ...params.InputProps,
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         )}
//       />
//     </Stack>
//   )
// }

// export default LiveSearch


// import { useState, useEffect } from 'react'
// import { Box, InputAdornment, Stack, TextField, Autocomplete } from '@mui/material'
// import SearchIcon from '@mui/icons-material/Search'
// import { useNavigate } from 'react-router-dom'
// import { API_URL } from 'config'
// import axios from 'axios'
// import { useError } from 'utils/hooks'

// const LiveSearch = ({ toggleDrawer, setState }) => {
//   const { setError } = useError()
//   const [open, setOpen] = useState(false)
//   const [inputValue, setInputValue] = useState('')
//   const [jsonResults, setJsonResults] = useState([])  // Kết quả tìm kiếm
//   const navigate = useNavigate()

//   // Gọi API để tìm kiếm sản phẩm khi inputValue thay đổi
//   useEffect(() => {
//     if (inputValue) {
//       const fetchSearchResults = async () => {
//         try {
//           const accessToken = localStorage.getItem('accessToken')
//           const res = await axios.get(`${API_URL}/products/live-search?keyword=${inputValue}`, {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           })
//           setJsonResults(res?.data?.result || [])  // Cập nhật kết quả tìm kiếm
//           setOpen(true)  // Mở Autocomplete khi có kết quả
//         } catch (error) {
//           setError(error)
//         }
//       }

//       fetchSearchResults()
//     } else {
//       setJsonResults([])  // Nếu không có inputValue thì xóa kết quả
//       setOpen(false)  // Đóng Autocomplete
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [inputValue])  // Khi inputValue thay đổi thì gọi lại API

//   const onKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       const product = jsonResults.find(
//         (element) => element.title.toLowerCase().trim() === e.target.value.toLowerCase().trim()
//       )
//       if (product) {
//         navigate(`/products/${product?._id}`)
//       }
//       setOpen(false)
//       setInputValue('')
//       if (setState && toggleDrawer) {
//         setState(false)
//         toggleDrawer()(false)
//       }
//     }
//   }

//   const handleClick = (id) => {
//     navigate(`/products/${id}`)
//     setOpen(false)
//     setInputValue('')
//     if (setState && toggleDrawer) {
//       setState(false)
//       toggleDrawer()(false)
//     }
//   }

//   return (
//     <Stack
//       spacing={2}
//       sx={{
//         flex: '1 1 0',
//         maxWidth: '670px',
//         mx: 'auto',
//       }}
//     >
//       <Autocomplete
//         freeSolo
//         open={open}
//         onOpen={() => {
//           if (inputValue) {
//             setOpen(true)
//           }
//         }}
//         onClose={() => setOpen(false)}
//         inputValue={inputValue}
//         onInputChange={(e, value) => {
//           setInputValue(value)

//           if (!value) {
//             setOpen(false)
//           }
//         }}
//         disableClearable
//         id="free-solo-live-search"
//         getOptionLabel={(jsonResults) =>
//           jsonResults?.title?.toLowerCase().trim() ? `${jsonResults?.name.toLowerCase().trim()}` : ''
//         }
//         options={jsonResults}
//         isOptionEqualToValue={(option, value) => option?.name === value.name}
//         renderOption={(props, jsonResults) => {
//           return (
//             <Box component="li" {...props} key={jsonResults?._id} onClick={() => handleClick(jsonResults?._id)}>
//               {jsonResults?.title}
//             </Box>
//           )
//         }}
//         renderInput={(params) => (
//           <TextField
//             fullWidth
//             onKeyPress={onKeyPress}
//             placeholder="Searching for..."
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderRadius: 10,
//                 },
//               },
//             }}
//             {...params}
//             InputProps={{
//               size: 'small',
//               ...params.InputProps,
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         )}
//       />
//     </Stack>
//   )
// }

// export default LiveSearch


import { useState, useEffect } from 'react'
import { Box, InputAdornment, Stack, TextField, Autocomplete } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import { API_URL } from 'config'
import axios from 'axios'
import { useError } from 'utils/hooks'

const LiveSearch = ({ toggleDrawer, setState }) => {
  const { setError } = useError()
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [jsonResults, setJsonResults] = useState([])  // Kết quả tìm kiếm
  const navigate = useNavigate()

  // Gọi API để tìm kiếm sản phẩm khi inputValue thay đổi
  useEffect(() => {
    if (inputValue) {
      const fetchSearchResults = async () => {
        try {
          const accessToken = localStorage.getItem('accessToken')
          const res = await axios.get(`${API_URL}/products/live-search?keyword=${inputValue}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          setJsonResults(res?.data?.result || [])  // Cập nhật kết quả tìm kiếm
          setOpen(res?.data?.result?.length > 0)  // Mở Autocomplete nếu có kết quả
        } catch (error) {
          setError(error)
        }
      }

      fetchSearchResults()
    } else {
      setJsonResults([])  // Nếu không có inputValue thì xóa kết quả
      setOpen(false)  // Đóng Autocomplete
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])  // Khi inputValue thay đổi thì gọi lại API

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const product = jsonResults.find(
        (element) => element.name.toLowerCase().trim() === e.target.value.toLowerCase().trim()
      )
      if (product) {
        navigate(`/products/${product.id}`)
      }
      setOpen(false)
      setInputValue('')
      if (setState && toggleDrawer) {
        setState(false)
        toggleDrawer()(false)
      }
    }
  }

  const handleClick = (id) => {
    navigate(`/products/${id}`)
    setOpen(false)
    setInputValue('')
    if (setState && toggleDrawer) {
      setState(false)
      toggleDrawer()(false)
    }
  }

  console.log(jsonResults)  // Kiểm tra giá trị jsonResults

  return (
    <Stack
      spacing={2}
      sx={{
        flex: '1 1 0',
        maxWidth: '670px',
        mx: 'auto',
      }}
    >
      <Autocomplete
        freeSolo
        open={open}
        onOpen={() => {
          if (inputValue && jsonResults.length > 0) {
            setOpen(true)
          }
        }}
        onClose={() => setOpen(false)}
        inputValue={inputValue}
        onInputChange={(e, value) => {
          setInputValue(value)

          if (!value) {
            setOpen(false)
          }
        }}
        disableClearable
        id="free-solo-live-search"
        getOptionLabel={(option) => option?.name?.toLowerCase().trim() || ''} // Chắc chắn gọi đúng trường name
        options={jsonResults}
        isOptionEqualToValue={(option, value) => option?.name === value.name} // So sánh theo 'name'
        renderOption={(props, option) => {
          return (
            <Box component="li" {...props} key={option.id} onClick={() => handleClick(option.id)}>
              {option?.name} {/* Hiển thị 'name' thay vì 'title' */}
            </Box>
          )
        }}
        renderInput={(params) => (
          <TextField
            fullWidth
            onKeyPress={onKeyPress}
            placeholder="Searching for..."
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderRadius: 10,
                },
              },
            }}
            {...params}
            InputProps={{
              size: 'small',
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Stack>
  )
}

export default LiveSearch
