import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Product, { IProductModel } from '../models/Product';
import Cart, { ICartModel } from '../models/Cart';
import { NavItem } from 'react-bootstrap';


// Adding default user id is here we can 
const userId = new ObjectId("62dc01d710236932557f3b6c");
const createCart = async (req: Request, res: Response) => {

    let products = req.body ?? null;
    try {

        if (!products || !Object.keys(products).length) {
            return res.send(400).json({ message: "No Product to add to a cart" })
        }

        // TODO: Quantity Check
        const productsData: IProductModel[] = await Product.find({
            _id: {
                $in: Object.keys(products).map(id => new ObjectId(id))
            },
            in_stock: true
        }).lean();

        if (productsData.length !== Object.keys(products).length) {
            return res.send(400).json({ message: "No Product to add to a cart" })
        }

        let productDataToSave = productsData.map(product => {
            return {
                productId: product._id,
                quantity: products[product._id].quantity,
                price: product.price
            }
        });

        const total_price = productDataToSave.reduce((total, item) => {
            return total + (item.price * item.quantity)
        }, 0);

        let cart: ICartModel = new Cart({
            items: productDataToSave,
            total_price,
            userId
        });
        await cart.save();
        res.status(201).json({ status: true });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const getCurrentActiveCart = async (req: Request, res: Response) => {

    try {
        const currentCart = await Cart.findOne({
            userId,
            status: 0
        }).sort({ _id: -1 }).lean();

        if (!currentCart) {
            return res.send(404).json({ message: "No cart exists" });
        }

        const productsData = await Product.find({
            _id: {
                $in: currentCart.items.map(item => item.productId)
            }
        }).lean();


        const cartItems = currentCart.items.map((item) => {
            const product = productsData.find(product => product._id.toString() === item.productId.toString());
            return {
                ...item,
                name: product?.name,
                sku: product?.sku
            }
        });

        const cartData = {
            ...currentCart,
            items: cartItems
        };

        res.status(200).json(cartData)
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

const cartController = { createCart, getCurrentActiveCart };
export default cartController;