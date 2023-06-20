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

// const express = require('express');
// const cors = require('cors');
// const { MongoClient } = require('mongodb');

// const server = express();
// server.use(cors());
// server.use(express.json());

// const url = process.env.MONGO_URL || 'mongodb+srv://stasprgiykhodko1:Hwsvg4KhDuJKOoKC@cluster0.rmymtql.mongodb.net/?retryWrites=true&w=majority';

// const client = new MongoClient(url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const dbName = 'shop-goods';

// // Connect to MongoDB server
// (async () => {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Failed to connect to MongoDB:', error);
//     process.exit(1);
//   }
// })();

// // Middleware to handle MongoDB errors
// server.use((error, req, res, next) => {
//   console.error('MongoDB error:', error);
//   res.status(500).json({ message: 'Internal server error' });
// });

// // Route handlers
// server.get('/server/collections', getCollections);
// server.get('/server/collections/:collectionName', getCollectionData);
// server.post('/server/save-order', saveOrder);

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// // Function to get collection names
// async function getCollections(req, res, next) {
//   try {
//     const db = client.db(dbName);
//     const collections = await db.listCollections().toArray();
//     const collectionNames = collections.map(collection => collection.name);
//     res.status(200).json(collectionNames);
//   } catch (error) {
//     next(error);
//   }
// }

// // Function to get data from a collection
// async function getCollectionData(req, res, next) {
//   try {
//     const db = client.db(dbName);
//     const { collectionName } = req.params;
//     const data = await db.collection(collectionName).find().toArray();
//     res.status(200).json(data);
//   } catch (error) {
//     next(error);
//   }
// }

// // Function to save an order
// async function saveOrder(req, res, next) {
//   try {
//     const db = client.db('saved-food-orders');
//     const { name, email, phone, address, items, totalAmount } = req.body;
//     const result = await db.collection('orderData').insertOne({
//       name,
//       email,
//       phone,
//       address,
//       items,
//       totalAmount,
//       createdAt: new Date(),
//     });
//     res.status(200).json({ orderId: result.insertedId });
//   } catch (error) {
//     next(error);
//   }
// }