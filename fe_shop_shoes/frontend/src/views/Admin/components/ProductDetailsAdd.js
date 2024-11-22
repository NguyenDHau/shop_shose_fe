import React, { useState } from 'react';
import NumberInput from './NumberInput';
import TextInput from './TextInput';

function ProductDetailsAdd({ productDetailAdd, setProductDetailAdd }) {
  const handleDetailChange = (index, field, value) => {
    const newDetails = [...productDetailAdd];
    newDetails[index][field] = value;
    setProductDetailAdd(newDetails);
  };
  const [selectedColor, setSelectedColor] = useState('');

  const addProductDetail = () => {
    setProductDetailAdd([...productDetailAdd, { colorId: '', fileUrl: '' }]);
  };
  console.log(productDetailAdd)
  const listColor = [
    {
      "id": 1,
      "colorName": "Green"
    },
    {
      "id": 2,
      "colorName": "Red"
    },
    {
      "id": 3,
      "colorName": "Yellow"
    }
  ]

  const handleChange = (event) => {
    setSelectedColor(event.target.value);
  };


  return (
    <div>
      <h3>Chi Tiết Sản Phẩm</h3>
      {/* {productDetailAdd?.map((detail, index) => (
        <div key={index}>
          <NumberInput
            label={`Mã màu (${index + 1})`}
            value={detail.colorId}
            onChange={(value) => handleDetailChange(index, 'colorId', value)}
          />
          <TextInput
            label={`URL ảnh (${index + 1})`}
            value={detail.fileUrl}
            onChange={(value) => handleDetailChange(index, 'fileUrl', value)}
          />
        </div>
      ))} */}
      <div>
        <label htmlFor="color-select">Chọn Màu:</label>
        <select id="color-select" value={selectedColor} onChange={handleChange}>
          <option value="" disabled>Chọn một màu</option>
          {listColor.map((color) => (
            <option key={color.id} value={color.id}>
              {color.colorName}
            </option>
          ))}
        </select>
      </div>
      <button type="button" onClick={addProductDetail}>
        Thêm Chi Tiết Sản Phẩm
      </button>
    </div>
  );
}

export default ProductDetailsAdd;
