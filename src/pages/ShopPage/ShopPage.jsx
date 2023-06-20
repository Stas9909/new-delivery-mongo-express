import './ShopPage.css'
import React, { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";

const ShopPage = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // fetch('http://localhost:5000/server/collections')
    fetch('https://new-delivery-mongo-express.onrender.com/server/collections')
      .then(res => res.json())
      .then(data => {
        setCollections(data);
      })
      .catch(error => console.log(error));
  }, []);

  return (
    <div className="shopPage">
      <ul className="shopPageUl">
        <h4>Shops:</h4>
        {collections && collections.length > 0 && collections.map(collection => (
          <li className="ShopsList" key={collection}>
            <NavLink className="link" to={`/new-delivery-mongo-express/shop/${collection}`}>
              <p className="shopTextName">{collection}</p>
            </NavLink>
          </li>
        ))}
      </ul>
      <Outlet />
    </div>
  );
};

export default ShopPage;