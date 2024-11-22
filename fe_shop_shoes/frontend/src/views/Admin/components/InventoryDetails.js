import React from 'react';
import NumberInput from './NumberInput';

function InventoryDetails({ inventory, setInventory }) {
  const handleInventoryChange = (index, field, value) => {
    const newInventory = [...inventory];
    newInventory[index][field] = value;
    setInventory(newInventory);
  };

  const addInventoryItem = () => {
    setInventory([...inventory, { sizeId: '', colorId: '', quantity: '' }]);
  };

  return (
    <div>
      <h3>Tồn Kho</h3>
      {inventory.map((item, index) => (
        <div key={index}>
          <NumberInput
            label={`Mã kích thước (${index + 1})`}
            value={item.sizeId}
            onChange={(value) => handleInventoryChange(index, 'sizeId', value)}
          />
          <NumberInput
            label={`Mã màu (${index + 1})`}
            value={item.colorId}
            onChange={(value) => handleInventoryChange(index, 'colorId', value)}
          />
          <NumberInput
            label={`Số lượng (${index + 1})`}
            value={item.quantity}
            onChange={(value) => handleInventoryChange(index, 'quantity', value)}
          />
        </div>
      ))}
      <button type="button" onClick={addInventoryItem}>
        Thêm Tồn Kho
      </button>
    </div>
  );
}

export default InventoryDetails;
