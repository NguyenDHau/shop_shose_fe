import { Box, Typography } from '@mui/material';

const Description = ({ product }) => {
  // Tách chuỗi description thành các câu dựa trên dấu chấm
  const sentences = product.description
    ? product.description.split('.').filter(sentence => sentence.trim() !== '')
    : [];

  return (
    <Box>
      {sentences.map((sentence, index) => (
        <Box 
          key={index} 
          display="flex" 
          alignItems="flex-start" 
          mb={1} // Thêm margin giữa các dòng
        >
          {/* Hiển thị số thứ tự */}
          <Typography variant="body2" fontWeight="bold" mr={1}>
            {index + 1}.
          </Typography>
          {/* Hiển thị nội dung */}
          <Typography fontSize={15}>
            {sentence.trim()}.
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default Description;

