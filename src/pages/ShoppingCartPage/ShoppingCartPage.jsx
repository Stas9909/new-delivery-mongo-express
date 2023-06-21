import React, { useEffect, useState } from "react";
import './ShoppingCartPage.css'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { emptyCart, removeFromLocalStorage, setCartFromLocalStorage } from '../../Redux/cart/cartActions';

const ShoppingCartPage = () => {
  const cartData = useSelector(state => state.cart)
  const dispatch = useDispatch();

  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    const cartFromLocalStorage = localStorage.getItem("cart");
    if (cartFromLocalStorage) {
      const parsedCart = JSON.parse(cartFromLocalStorage);
      dispatch(setCartFromLocalStorage(parsedCart));
    }
    // ({
    //   type: 'SET_CART_FROM_LOCAL_STORAGE',
    //   payload: JSON.parse(cartRecovery)
    // });
  }, [dispatch]);

  useEffect(() => {
    let timer;
    if (orderSaved) {
      timer = setTimeout(() => {
        setOrderSaved(false);
      }, 5000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [orderSaved]);

  const totalAmount = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);


  const increasrQuantity = (id) => {
    if (cartData.find((cart) => cart.id === id).quantity >= 10) {
      return;
    }
    dispatch({
      type: 'INCREASE_ITEM_COUNT',
      payload: id
    })
  }

  const decreaseQuantity = (id) => {
    if (cartData.find((cart) => cart.id === id).quantity === 1) {
      return;
    }
    dispatch({
      type: 'DECREASE_ITEM_COUNT',
      payload: id
    })
  }

  const removeItem = (id) => {
    dispatch({
      type: 'REMOVE_CART_ITEM',
      payload: id
    })

    dispatch(removeFromLocalStorage(id));
    //или
    // const filteredItemsFromLocalStorage = cartData.filter((item) => item.id !== id);
    // localStorage.setItem('cart', JSON.stringify(filteredItemsFromLocalStorage));
    // dispatch(removeFromLocalStorage(filteredItemsFromLocalStorage));
  }

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // setSubmitting(true);
    const { name, email, phone, address } = values;
    const orderData = {
      name,
      email,
      phone,
      address,
      items: cartData,
      totalAmount
    }
    // axios.post('http://localhost:5000/server/save-order', orderData, {
      axios.post('https://new-delivery-mongo-express.onrender.com/server/save-order', orderData, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        console.log("Order saved successfully:", res.data)
        resetForm();
        dispatch(emptyCart())
        localStorage.removeItem("cart");
        setOrderSaved(true)//здесь мы устанавливаем состояние, что заказ сохранен
      })
      .catch(err => {
        console.log("Error saving order:", err)
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  useEffect(() => {
    if (orderSaved) {
      const updatedCart = [];
      dispatch(setCartFromLocalStorage(updatedCart));
    }
  }, [orderSaved, dispatch]);

  return (
    <>
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          address: "",
        }}
        validationSchema={Yup.object({
          name: Yup.string()
            .required("Required"),
          email: Yup.string().email("Invalid email address")
            .required("Required")
            .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/i, "Invalid email address"),
          phone: Yup.number()
            .required("Required")
            .positive()
            .integer()
            .min(10, "Min 10 digits"),
          address: Yup.string()
        })}
        onSubmit={handleSubmit}
      >
        {({ values, touched, setFieldValue, errors, isSubmitting }) => {
          return (
            <Form>
              <div className="formContainer">
                <div className="dataForSubmit">
                  <div className="fieldsContainer">
                    <div className="field">
                      <label htmlFor="name">Name</label>
                      <Field
                        id="name"
                        className="my-field"
                        type="text"
                        name="name"
                        placeholder="Введите имя"
                      />
                      {touched.name && errors.name && (
                        <ErrorMessage name="name" component="div" className="error-message" />
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor="email">Email</label>
                      <Field
                        id="email"
                        className="my-field"
                        type="email"
                        name="email"
                        placeholder="Введите ваш email"
                      />
                      {touched.email && errors.email && (
                        <ErrorMessage name="email" component="div" className="error-message" />
                      )}
                    </div>
                    <div className="field">
                      <label htmlFor="phone">Phone</label>
                      <Field
                        className="my-field"
                        id="phone"
                        type="number"
                        name="phone"
                        placeholder="введите номер телефона"
                      />
                      {touched.phone && errors.phone && (
                        <ErrorMessage name="phone" component="div" className="error-message" />
                      )}
                    </div>

                    <div className="field">
                      <label htmlFor="address">Address</label>
                      <Field
                        className="my-field"
                        id="address"
                        type="text"
                        name="address"
                        placeholder="введите адрес"
                      />
                      <ErrorMessage name="address" />
                    </div>
                  </div>

                  <div className="orderContainer">
                    {cartData.map(item => (
                      <div className="orederedDish" key={item.id}>
                        <div className="divForImage">
                          <img className="dishImage" src={`/new-delivery-mongo-express/${item.image}`} alt={item.name} />
                        </div>
                        <div className="infoAndHandling">
                          <div className="currentInfo">
                            <h4 className="headerName">{item.name}</h4>
                            <p className="foodPrice">{item.price * item.quantity} грн.</p>
                          </div>
                          <div className="listeners">
                            <div className="counter">
                              <div className="divForModified">
                                <button type="button" className="modifiedItem plus" onClick={() => increasrQuantity(item.id)}>
                                  +
                                </button>
                                <button type="button" className="modifiedItem minus" onClick={() => decreaseQuantity(item.id)}>
                                  -
                                </button>
                              </div>
                              <div className="quantityField">{item.quantity}</div>
                            </div>
                            <button
                              type="button"
                              className="removeItem"
                              onClick={() => removeItem(item.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="submitTotalResult">
                  <div className="quantityLowerField">Total price: {totalAmount}</div>
                  <button className="submitButton" type="submit" disabled={isSubmitting}>Submit</button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
      {orderSaved && <p className="orderSuccess">Заказ сохранен!</p>}
    </>
  )
}

export default ShoppingCartPage
