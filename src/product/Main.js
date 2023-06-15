// src/Main.js
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBasket, faTrash, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';

const Main = () => {
    const { products, addProduct, updateProduct, removeProduct, handleLogout, isLoggedIn, userRole, shoppingCart, addToShoppingCart } = useContext(AppContext);
    const navigate = useNavigate();
    const [shoppingCartItemCount, setShoppingCartItemCount] = useState(0);

    const [modalProductName, setModalProductName] = useState('');
    const [modalProductDescription, setModalProductDescription] = useState(" ");
    const [modalProductPrice, setModalProductPrice] = useState(0);
    const [modalProductIdOnUpdate, setModalProductIdOnUpdate] = useState(null);
    const [modalCreateOpen, setModalCreateOpen] = useState(false);
    const [modalDetailOpen, setModalDetailOpen] = useState(false);

    useEffect(() => {
        let counter = 0;
        shoppingCart.forEach(item => {
            counter += item.count;
        });
        setShoppingCartItemCount(counter);
    }, [shoppingCart]); // Přidejte shoppingCart jako závislost

    useEffect(() => {
        if (isLoggedIn !== true) {
            navigate('/');
        }
        return () => { }
    });

    const handleDetailProduct = (product, operation) => {
        if (operation === "onOpen") {
            setModalDetailOpen(true);

            setModalProductName(product?.name);
            setModalProductDescription(product?.description);
            setModalProductPrice(product?.price);
        }
        else {
            setModalDetailOpen(false);

            setModalProductName('');
            setModalProductDescription('');
            setModalProductPrice(0);
        }
    };

    const handleProductRemove = (productId) => {
        if (userRole === "admin") {
            removeProduct(productId);
        }
    };

    const handleProductUpdate = (productId) => {
        if (userRole === "admin") {
            const productExist = products.find((item) => item._id === productId);

            if (productExist !== undefined) {
                setModalProductIdOnUpdate(productId);
                setModalProductName(productExist?.name);
                setModalProductDescription(productExist?.description);
                setModalProductPrice(productExist?.price);
                setModalCreateOpen(true);
            }
        }
    }

    const handleCreateProduct = () => {
        if (userRole === "admin") {
            const product = {};
            const existingProductName = products.find((item) => item.name === modalProductName && item._id !== modalProductIdOnUpdate);
            const productFromArray = products.find((item) => item._id === modalProductIdOnUpdate);

            if (existingProductName === undefined &&
                (modalProductName.length >= 2 && modalProductName.length < 1000) &&
                (modalProductDescription.length >= 0 && modalProductDescription.length < 1000) &&
                (modalProductPrice >= 0 && !isNaN(modalProductPrice))) {
                product.name = modalProductName;
                product.description = modalProductDescription;
                product.price = modalProductPrice;

                if (modalProductIdOnUpdate !== null &&
                    (productFromArray.name !== modalProductName || productFromArray.description !== modalProductDescription || productFromArray.price !== modalProductPrice)) {
                    product._id = modalProductIdOnUpdate;
                    updateProduct(product);
                }
                else {
                    addProduct(product);
                }

                setModalProductName('');
                setModalProductDescription('');
                setModalProductPrice(0);
                setModalProductIdOnUpdate(null);
                setModalCreateOpen(false);
            }
            else {
                console.log("Něco bylo zadáno špatně.");
            }
        }
    }

    const handleModalClose = () => {
        setModalProductName('');
        setModalProductDescription('');
        setModalProductPrice(0);
        setModalProductIdOnUpdate(null);
        setModalCreateOpen(false);
    }

    const handleAddToShoppingCart = (productId) => {
        addToShoppingCart(productId)
    };

    const handleToShoppingCart = () => {
        if (shoppingCartItemCount !== 0)
            navigate('/shoppingCart');
    };

    const handleUserLogout = () => {
        handleLogout();
        navigate('/');
    };

    return isLoggedIn && (
        <div>
            <div className='text-center'>
                <h1>Produkty</h1>
                <p> {userRole} </p>
                <button className="btn btn-outline-primary m-1" onClick={handleUserLogout}>Odhlásit</button>
            </div>
            <hr />

            <div className='m-3' style={{ textAlign: 'right' }}>
                <button className={`btn btn-outline-primary ${shoppingCartItemCount === 0 ? "disabled" : "enabled"}`} onClick={handleToShoppingCart}>
                    Nákupní košík - <strong style={{ color: 'black' }}>{shoppingCartItemCount}</strong>
                </button>
                {
                    userRole === "admin" && <button className='btn btn-outline-primary m-1' onClick={() => setModalCreateOpen(true)}>
                        Vytvořit Produkt
                    </button>
                }
            </div>

            <Modal show={modalCreateOpen}>
                <Modal.Header>
                    <Modal.Title>{modalProductIdOnUpdate !== null ? "Aktualizovat produkt" : "Nový produkt"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="" role="document">
                        <div className="">
                            <form>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="product-name" className="col-form-label">Název produktu:</label>
                                        <input type="text" className="form-control" id="product-name" value={modalProductName} onChange={(e) => setModalProductName(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price-text" className="col-form-label">Cena produktu:</label>
                                        <input className="form-control" type='number' id="price-text" value={modalProductPrice} onChange={(e) => setModalProductPrice(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description-text" className="col-form-label">Popis produktu:</label>
                                        <textarea className="form-control" id="description-text" value={modalProductDescription} onChange={(e) => setModalProductDescription(e.target.value)}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleModalClose}>Zpět</button>
                                    <button type="button" className="btn btn-primary" onClick={handleCreateProduct}>{modalProductIdOnUpdate !== null ? "Aktualizovat" : "Vytvořit"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            <Modal show={modalDetailOpen}>
                <Modal.Header>
                    <Modal.Title>Detail produktu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="" role="document">
                        <div className="">
                            <form>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="product-name" className="col-form-label">Název produktu: <strong>{modalProductName}</strong> </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="product-name" className="col-form-label">Cena produktu: <strong>{modalProductPrice}</strong> </label>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="product-name" className="col-form-label">Popis produktu: ({modalProductDescription.length} znaků)</label>
                                        <p>
                                            <strong>{modalProductDescription}</strong>

                                        </p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => handleDetailProduct(null, "onClose")}>Zavřít</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            <div className="row m-0">
                {products.map((product) => (
                    <div key={product._id} className="col-md-4 p-1">
                        <div className="card text-center">
                            <div className="card-body">
                                <div style={{ textAlign: 'right' }}>
                                    <button className='btn' onClick={() => handleAddToShoppingCart(product._id)}>
                                        <FontAwesomeIcon icon={faShoppingBasket} style={{ fontSize: '20px' }} />
                                    </button>
                                </div>
                                <h5 className="card-title">{product.name}</h5>
                                <p className="card-text">{product.price}</p>
                                <button className="btn btn-outline-primary m-1" onClick={() => handleDetailProduct(product, "onOpen")}>Detail</button>
                                {userRole === "admin" && <button
                                    className="btn btn-outline-danger m-1"
                                    onClick={() => handleProductRemove(product._id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} style={{ fontSize: '20px' }} />
                                </button>
                                }

                                {userRole === "admin" && <button
                                    className="btn btn-outline-warning m-1"
                                    onClick={() => handleProductUpdate(product._id)}
                                >
                                    <FontAwesomeIcon icon={faRefresh} style={{ fontSize: '20px' }} />
                                </button>
                                }

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
