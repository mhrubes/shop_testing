// src/itemDetail.js
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faXmark } from '@fortawesome/free-solid-svg-icons';

const ShoppingCart = () => {
  const { shoppingCart, isLoggedIn, emptyShoppingCart, updateShoppingCartItem, deleteShoppingCartItem } = useContext(AppContext);
  const navigate = useNavigate();
  const [shoppingCartItemCount, setShoppingCartItemCount] = useState(0);
  const [shoppingCartItemsPrice, setShoppingCartItemsPrice] = useState(0);

  useEffect(() => {
    let counter = 0;
    let countPrice = 0;
    shoppingCart.forEach(item => {
      counter += item.count;
      countPrice += (item.price * item.count);
    });
    setShoppingCartItemCount(counter);
    setShoppingCartItemsPrice(countPrice);
  }, [shoppingCart]); // Přidejte shoppingCart jako závislost

  useEffect(() => {
    if (isLoggedIn !== true) {
      navigate('/');
    }
    return () => { }
  });

  const handleUpdateShoppingCartItem = (itemId, operation) => {
    if (operation)
      updateShoppingCartItem(itemId, operation);
    else
      updateShoppingCartItem(itemId, operation);
  }

  const handleDeleteShoppingCartItem = (itemId) => {
    deleteShoppingCartItem(itemId);
  }

  const handleEmptyShoppingCart = () => {
    emptyShoppingCart();
  }

  return isLoggedIn && (
    <div className='container text-center'>
      <h1>Nákupní košík <strong> {shoppingCartItemCount} </strong> </h1>
      <button className='btn btn-outline-primary' onClick={() => navigate(-1)}>Zpět</button>
      <hr />

      {shoppingCartItemCount !== 0 &&
        <div style={{ textAlign: 'right' }}>
          <button className='btn btn-outline-warning' onClick={() => handleEmptyShoppingCart()}>
            Vysypat košík
          </button>
        </div>}

      <div className="row m-0">
        {shoppingCart !== [] && shoppingCart.map((item) => (
          <div key={item._id} className="col-md-4">
            <div className="card text-center">
              <div className="card-body">
                <div style={{ textAlign: 'right' }}>
                  <button className='btn' onClick={() => handleDeleteShoppingCartItem(item._id)}>
                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: "20px" }} />
                  </button>
                </div>

                <h5 className="card-title">{item.name}</h5>
                <p className="card-title">Počet: {item.count}</p>
                <p className="card-text">Cena: {item.price}</p>
                <hr />
                <p className="card-text">Celková Cena: {item.price * item.count}</p>

                <button className={`btn btn-outline-danger m-1 ${item.count === 1 ? "disabled" : "enabled"}`} onClick={() => handleUpdateShoppingCartItem(item._id, false)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>

                <button className='btn btn-outline-success m-1' onClick={() => handleUpdateShoppingCartItem(item._id, true)}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {shoppingCart.length > 0 && <div>
        <hr />
        <table className='table mt-3'>
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Cena</th>
              <th scope="col">Počet</th>
              <th scope="col">Součet</th>
            </tr>
          </thead>
          <tbody>
            {shoppingCart !== [] && shoppingCart.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.count}</td>
                <td>{item.price * item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {shoppingCart.length > 0 &&
        <div className="row m-0 mb-5">
          <hr />
          <div className="col-md-6"></div>
          <div className="col-md-6" style={{ fontSize: "17px", textAlign: "right" }}>
            <p>
              Celkový počet všech kusů: <strong>{shoppingCartItemCount}</strong>
            </p>
            <p>
              Celková cena všech kusů: <strong>{shoppingCartItemsPrice}</strong>
            </p>
          </div>
        </div>}

      {shoppingCart.length === 0 &&
        <h3>Váš košík je prázdný</h3>
      }

    </div >
  );
};

export default ShoppingCart;
