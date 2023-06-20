import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import './ShopMenuPage.css';
import FoodList from "../../components/FoodList/FoodList";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ShopMenuPage = () => {
  const params = useParams();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const cartData = useSelector(data => data.cart)

  const getCurrentShop = () => {
    return cartData.length > 0 ? cartData[0].restaurant : null
  }

  useEffect(() => {
    setIsLoading(true);
    // fetch(`http://localhost:5000/server/collections/${params.id}`)
    fetch(`https://new-delivery-npmmongo-express.onrender.com/server/collections/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }, [params]);

  const memoizedVData = useMemo(() => data, [data]);

  return (
    <div className="shopMenuPage">
      <ul className="shopMenuUl">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <FoodList
            currentShop={getCurrentShop()}
            data={memoizedVData} />
        )}
      </ul>
    </div>
  );
};

export default ShopMenuPage;