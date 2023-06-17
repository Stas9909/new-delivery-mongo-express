export const setCartItem = (item) => ({
  type: "SET_CART_ITEM",
  payload: item,
});

export const removeCartItem = (id) => ({
  type: 'REMOVE_CART_ITEM',
  payload: id
});

export const increaseItemCount = (id) => ({
  type: 'INCREASE_ITEM_COUNT',
  payload: id
});

export const decreaseItemCount = (id) => ({
  type: 'DECREASE_ITEM_COUNT',
  payload: id
});

export const emptyCart = () => ({
  type: 'EMPTY_CART',
});

export const setCartFromLocalStorage = (cart) => ({
  type: 'SET_CART_FROM_LOCAL_STORAGE',
  payload: cart
})

export const removeFromLocalStorage = (id) => ({
  type: 'REMOVE_FROM_LOCAL_STORAGE',
  payload: id
})