import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Card, Col, Row } from 'react-bootstrap';

function Product() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [isLoaded, setLoaded] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState({});

    useEffect(() => {
        if (!isLoaded) {
            (async function fetchData() {
                try {
                    const result = await axios.get('/api/product/get?available=yes');
                    setProducts(result?.data?.products || []);
                    setLoaded(true)
                } catch (err) {
                    alert("Something is wrong with the product list")
                }
            })();
        }
    }, [isLoaded]);

    function addProduct(product) {

        try {
            const productData = selectedProducts[product._id] ?? {
                quantity: 0
            };

            if (product.stock > productData.quantity) {
                productData.quantity += 1;
            }
            const newProductsData = {
                ...selectedProducts,
                [product._id]: productData
            }
            setSelectedProducts(newProductsData);
        } catch (err) {
            debugger;
        }
    }

    function removeProduct(product) {
        const productData = selectedProducts[product._id] ?? {
            quantity: 0
        };

        if (productData.quantity > 0) {
            productData.quantity -= 1;
        }
        const newProductsData = {
            ...selectedProducts,
            [product._id]: productData
        }
        setSelectedProducts(newProductsData);
    }


    function addToCart() {

        let totalProductQuantity = 0;
        const keys = Object.keys(selectedProducts ?? {}) ?? [];

        let filteredSelectedProducts = {};

        if (keys.length) {
            keys.forEach((key) => {

                const quantity = selectedProducts[key].quantity;

                if (quantity) {
                    filteredSelectedProducts[key] = {
                        quantity
                    }
                }
                totalProductQuantity += quantity;
            });
        }


        if (!totalProductQuantity) {
            alert("Select at-least one product");
            return
        }

        (async function fetchData() {
            try {
                await axios.post('/api/cart/create', filteredSelectedProducts);
                setLoaded(true);
                navigate('/cart');
            } catch (err) {
                return alert("Something is wrong when creating a cart")
            }
        })();
    }

    return (
        <>
            <Row>
                <h2>Products</h2>
                {isLoaded && products.map((product) => {
                    return <Col md={3} key={product._id}>
                        <Card style={{ width: '15rem', "margin": "1rem" }}>
                            <Card.Img variant="top" src="/dummy-prod.jpeg" alt={product.name} />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>
                                    {product.short_description} <br />

                                    Price: {product.price} Rs
                                </Card.Text>
                                <Button variant="primary" onClick={() => {
                                    addProduct(product);
                                }}>+</Button>{" "}
                                <Button variant="danger" onClick={() => {
                                    removeProduct(product)
                                }}>-</Button> {" "}
                                Total added: {selectedProducts[product._id]?.quantity ?? 0}
                            </Card.Body>
                        </Card>

                    </Col>

                })}
            </Row>
            <Row>
                <Col>
                    <Button onClick={() => addToCart()}>Buy Now</Button>
                </Col>
            </Row>
        </>
    )
}
export default Product;

