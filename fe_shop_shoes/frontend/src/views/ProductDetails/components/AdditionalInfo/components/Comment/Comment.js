// import { useState } from 'react'
// import { Typography, Box, Button, TextField, Rating } from '@mui/material'
// import { Review } from './components'
// import { useAuth } from 'core'

// export default function Comment({ reviews }) {
//   const { user } = useAuth()
//   const [rating, setRating] = useState(0)
//   const [comment, setComment] = useState('')
//   const [posts, setPosts] = useState(reviews)

//   const handleRatingChange = (event) => {
//     const rate = Number(event.target.value)
//     setRating(rate)
//   }

//   const handleCommentChange = (event) => {
//     const val = event.target.value
//     setComment(val)
//   }

//   const doSubmit = () => {
//     const newPost = { author: user.name, date: 'now', comment, rating }
//     posts.push(newPost)
//     setRating(0)
//     setPosts(posts)
//     setComment('')
//   }

//   return (
//     <>
//       {posts.map((post, index) => (
//         <Review review={post} key={`post-${index}`} />
//       ))}

//       <Box display="flex" alignItems="flex-start" flexDirection="column" marginTop={3}>
//         <Typography variant="h5" fontWeight={600}>
//           Write a Review for this product
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
//           <Box display="flex" gap={1} sx={{ my: 2 }}>
//             <Typography fontWeight={600}>Your Rating</Typography>
//             <Typography fontWeight={600} color="primary">
//               *
//             </Typography>
//           </Box>
//         </Box>
//         <Rating value={rating} onChange={handleRatingChange} />
//       </Box>

//       <Box component="form" autoComplete="off">
//         <Box>
//           <Box display="flex" gap={1} sx={{ my: 2 }}>
//             <Typography fontWeight={600}>Your Review</Typography>
//             <Typography fontWeight={600} color="primary">
//               *
//             </Typography>
//           </Box>

//           <TextField
//             fullWidth
//             required
//             size="small"
//             id="outlined-multiline-static"
//             placeholder="Write a review here..."
//             multiline
//             rows={8}
//             value={comment}
//             onChange={handleCommentChange}
//             sx={{ marginBottom: 2 }}
//           />
//         </Box>
//         <Button
//           disabled={comment.trim() === '' || rating === 0 ? true : false}
//           onClick={doSubmit}
//           variant="contained"
//           color="primary"
//         >
//           Submit
//         </Button>
//       </Box>
//     </>
//   )
// }


import { useState } from 'react';
import { Typography, Box, Button, TextField, Rating } from '@mui/material';
import { Review } from './components';
import { useAuth } from 'core';
import { useParams } from 'react-router-dom';

export default function Comment({ reviews }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [posts, setPosts] = useState(reviews);
  const { id } = useParams();

  const productId = id;
  const userId = localStorage.getItem('userId');
  console.log('User ID:', userId);

  const handleRatingChange = (event) => {
    const rate = Number(event.target.value);
    setRating(rate);
  };

  const handleCommentChange = (event) => {
    const val = event.target.value;
    setComment(val);
  };

  const doSubmit = async () => {
    // Tạo dữ liệu bài đánh giá mới
    const newPost = {
      productId,
      userId,
      review: comment,
      start: rating,
    };

    const token = localStorage.getItem('accessToken'); // Thay 'token' bằng tên khóa thực tế bạn đã lưu

    try {
      // Gửi yêu cầu POST đến API với token
      const response = await fetch('http://localhost:8080/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Đính kèm token vào header
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Failed to post review');
      }

      // Nếu thành công, cập nhật danh sách bài đánh giá
      const createdReview = await response.json();
      setPosts([...posts, createdReview]);
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  return (
    <>
      {posts.map((post, index) => (
        <Review review={post} key={`post-${index}`} />
      ))}

      <Box display="flex" alignItems="flex-start" flexDirection="column" marginTop={3}>
        <Typography variant="h5" fontWeight={600}>
          Write a Review for this product
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box display="flex" gap={1} sx={{ my: 2 }}>
            <Typography fontWeight={600}>Your Rating</Typography>
            <Typography fontWeight={600} color="primary">
              *
            </Typography>
          </Box>
        </Box>
        <Rating value={rating} onChange={handleRatingChange} />
      </Box>

      <Box component="form" autoComplete="off">
        <Box>
          <Box display="flex" gap={1} sx={{ my: 2 }}>
            <Typography fontWeight={600}>Your Review</Typography>
            <Typography fontWeight={600} color="primary">
              *
            </Typography>
          </Box>

          <TextField
            fullWidth
            required
            size="small"
            id="outlined-multiline-static"
            placeholder="Write a review here..."
            multiline
            rows={8}
            value={comment}
            onChange={handleCommentChange}
            sx={{ marginBottom: 2 }}
          />
        </Box>
        <Button
          disabled={comment.trim() === '' || rating === 0}
          onClick={doSubmit}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      </Box>
    </>
  );
}
