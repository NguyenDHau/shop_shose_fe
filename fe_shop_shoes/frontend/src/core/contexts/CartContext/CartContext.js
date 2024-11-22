
import { createContext, useReducer, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CART_LOADED':
      return {
        ...state,
        cart: payload,
        isCartLoading: false,
      };
    case 'UPDATE_TOTALS':
      return {
        ...state,
        quantity: payload.quantity,
        totalPrice: payload.totalPrice,
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === payload.id ? { ...item, quantity: payload.quantity } : item
        ),
      };
    case 'REMOVE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== payload),
      };
    case 'CART_LOADED_ERROR':
      return {
        ...state,
        isCartLoading: false,
      };
    case 'RESET_CART':
      localStorage.removeItem('cart');
      return {
        ...state,
        cart: [],
        isCartLoading: false,
      };
    default:
      return state;
  }
};

const initialState = {
  cart: [],
  quantity: 0,
  totalPrice: 0,
  isCartLoading: true,
};

const CartContext = createContext(initialState);

const CartProvider = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  const fetchCartDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/carts/details/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fetchedCart = response.data;
      const totalQuantity = fetchedCart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = fetchedCart.reduce((sum, item) => sum + getFinalPrice(item) * item.quantity, 0);

      dispatch({ type: 'CART_LOADED', payload: fetchedCart });
      dispatch({ type: 'UPDATE_TOTALS', payload: { quantity: totalQuantity, totalPrice: totalPrice } });
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      dispatch({ type: 'CART_LOADED_ERROR' });
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchCartDetails();
    }
  }, [userId, token]);

  const addToCart = async (inventoryId, quantity = 1) => {
    if (!userId || !inventoryId || quantity <= 0) {
      alert('Vui lòng chọn đầy đủ thông tin và nhập số lượng hợp lệ.');
      return;
    }

    try {
      const existingProduct = state.cart.find(item => item.inventoryId === inventoryId);

      if (existingProduct) {
        const newQuantity = existingProduct.quantity + quantity;
        await axios.put(
          `http://localhost:8080/api/carts/${existingProduct.id}`,
          { userId: parseInt(userId, 10), inventoryId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:8080/api/carts',
          { userId: parseInt(userId, 10), inventoryId, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      fetchCartDetails();
      enqueueSnackbar('Thêm vào giỏ hàng thành công!', { variant: 'success' });
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
    }
  };

  const getFinalPrice = (product) => {
    return product.discountPercentage > 0
      ? product.price - (product.price / 100) * product.discountPercentage
      : product.price;
  };

  const updateQuantity = async (cartId, quantity, inventoryId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/carts/${cartId}`,
        { quantity, userId, inventoryId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { id: cartId, quantity },
      });
      fetchCartDetails();
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  const removeProduct = async (cartId) => {
    try {
      await axios.delete(`http://localhost:8080/api/carts/${cartId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch({
        type: 'REMOVE_CART_ITEM',
        payload: cartId,
      });
      fetchCartDetails();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  };

  const resetCart = async () => {
    try {
      const cartIds = state.cart.map(item => item.id);
      const accessToken = localStorage.getItem('accessToken');
  
      await Promise.all(cartIds.map(id =>
        axios.delete(`http://localhost:8080/api/carts/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      ));
  
      dispatch({ type: 'RESET_CART' });
  
      // Gọi lại fetchCartDetails để cập nhật state và render lại giao diện
      await fetchCartDetails();
  
      console.log('Giỏ hàng đã được xóa thành công');
    } catch (error) {
      console.error('Lỗi khi xóa giỏ hàng:', error);
      alert('Có lỗi xảy ra khi xóa giỏ hàng');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        quantity: state.quantity,
        totalPrice: state.totalPrice,
        isCartLoading: state.isCartLoading,
        resetCart,
        updateQuantity,
        removeProduct,
        getFinalPrice,
        addToCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart can only be used inside CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
