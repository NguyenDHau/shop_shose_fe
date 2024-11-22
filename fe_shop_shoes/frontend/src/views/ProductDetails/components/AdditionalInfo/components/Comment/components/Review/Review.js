// import { Box, Avatar, Typography, Rating } from '@mui/material'

// const Review = ({ review }) => {
//   return (
//     <Box
//       sx={{
//         gap: 2,
//         display: 'flex',
//         flexDirection: 'column',
//         my: 2,
//         maxWidth: '600px',
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//         <Avatar src={review.image} alt={review.author} sx={{ width: 48, height: 48 }} />
//         <Box sx={{ ml: 1 }}>
//           <Typography fontWeight={600}>{review.author}</Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             <Rating value={review.rating} size="small" readOnly />
//             <Typography fontWeight={600} fontSize={14}>
//               {review.rating}
//             </Typography>
//             <Typography fontSize={14}>{review.date}</Typography>
//           </Box>
//         </Box>
//       </Box>
//       <Box>
//         <Typography fontSize={14} color={(theme) => theme.palette.grey[600]}>
//           {review.comment}
//         </Typography>
//       </Box>
//     </Box>
//   )
// }

// export default Review


import { useEffect, useState, useRef } from 'react';
import { Box, Avatar, Typography, Rating } from '@mui/material';
import { useParams } from 'react-router-dom';

const Review = ({ review }) => {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexDirection: 'column',
        my: 2,
        maxWidth: '600px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Avatar
          src={review.fileImgUrl || ''}
          alt={review.firstName || 'Anonymous'}
          sx={{ width: 48, height: 48 }}
        />
        <Box sx={{ ml: 1 }}>
          <Typography fontWeight={600}>{review.firstName || 'Anonymous'}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={review.start} size="small" readOnly />
            <Typography fontWeight={600} fontSize={14}>
              {review.start}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography fontSize={14} color={(theme) => theme.palette.grey[600]}>
          {review.review}
        </Typography>
      </Box>
    </Box>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const { id } = useParams();
  const hasFetchedRef = useRef(false); // Use ref instead of state for tracking

  console.log("id",id)

  useEffect(() => {
    const fetchReviews = async () => {
      if (id && !hasFetchedRef.current) {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`http://localhost:8080/api/reviews/product/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch reviews');
          }
  
          const data = await response.json();
          setReviews(data);
          hasFetchedRef.current = true; // Đảm bảo chỉ fetch một lần
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };
  
    fetchReviews();
  }, [id]);
  
  return (
    <Box>
      {reviews.map((review, index) => (
        <Review review={review} key={index} />
      ))}
    </Box>
  );
}