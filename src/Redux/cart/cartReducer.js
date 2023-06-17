let initialState = []

const cartReducer = (dataState = initialState, action) => {
  switch (action.type) {
    case "SET_CART_ITEM":
      return [...dataState, action.payload];

    case 'INCREASE_ITEM_COUNT':
      const increasedItem = dataState.map((item) => {
        if (item.id === action.payload) {
          return { ...item, quantity: item.quantity + 1 }
        }
        return item;
      })
      return increasedItem;

    case 'DECREASE_ITEM_COUNT':
      const reducedItem = dataState.map((item) => {
        if (item.id === action.payload) {
          return { ...item, quantity: item.quantity - 1 }
        }
        return item;
      })
      return reducedItem;

    case 'REMOVE_CART_ITEM':
      const filteredItems = dataState.filter((item) => item.id !== action.payload);
      return filteredItems;

    case 'EMPTY_CART':
      return [];

    case 'SET_CART_FROM_LOCAL_STORAGE':
      return action.payload;

    case 'REMOVE_FROM_LOCAL_STORAGE':
      const filteredItemsFromLocalStorage = dataState.filter((item) => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(filteredItemsFromLocalStorage));
      return filteredItemsFromLocalStorage;
    //или
    // return action.payload;

    default:
      return dataState;
  }
}

export default cartReducer;