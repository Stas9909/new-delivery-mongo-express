import React from "react";
import { NavLink } from "react-router-dom";
import './Header.css'
import { useSelector } from "react-redux";

const Header = () => {
  const cartData = useSelector(state => state.cart);

  return (
    <header>
      <div className="navBlockFirst">
        <NavLink className="link" to='/'>Shop</NavLink>
      </div>
      <div className="navBlockSecond">
        <NavLink className={`link${cartData.length ? ' highlighted' : ''}`} to='cart'>Shopping cart</NavLink>
      </div>
    </header>
  )
}

export default Header