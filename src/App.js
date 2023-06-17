import React from 'react';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Wrapper from './components/Wrapper/Wrapper';
import ShopPage from './pages/ShopPage/ShopPage';
import ShoppingCartPage from './pages/ShoppingCartPage/ShoppingCartPage';
import ShopDishesPage from './pages/ShopDishesPages/ShopMenuPage';

function App() {
    return (
        <>
            <Routes>
                <Route path='/new-delivery-mongo-express/' element={<Wrapper />}>
                    <Route path='/new-delivery-mongo-express/' element={<ShopPage />}>
                        <Route path="/new-delivery-mongo-express/shop/:id/" element={<ShopDishesPage />} />
                    </Route>
                    <Route path='/new-delivery-mongo-express/cart' element={<ShoppingCartPage />} />
                </Route>
            </Routes>
        </>
    )
}

export default App;