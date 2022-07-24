import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

function Cart() {
    const [cart, setCart] = useState(null);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            (async function fetchData() {
                try {
                    const result = await axios.get('/api/cart/current');
                    setCart(result?.data || null);
                    setLoaded(true)
                } catch (err) {
                    alert("Something is wrong with the cart");
                }
            })();
        }
    }, [isLoaded]);

    function buyNow() {

        return alert("Note: This will go for address and payment page")
    }


    return (
        <>
            {isLoaded &&
                <Row>
                    <Row>
                        <h2>Current Cart </h2>
                        {cart.items.map((item) => {
                            return <Col md={3} key={item._id}>
                                <Card style={{ width: '15rem', "margin": "1rem" }}>
                                    <Card.Img variant="top" src="/dummy-prod.jpeg" alt={item.name} />
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>
                                            Price: {item.price} * {item.quantity} = {item.price * item.quantity} Rs
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        })}
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Card>
                                <Card.Header>Total Amount: {cart.total_price} rs</Card.Header>
                                <Card.Body>
                                    <Button onClick={() => buyNow()}>Pay Now</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Row>
            }
        </>
    )
}
export default Cart;