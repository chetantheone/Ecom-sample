"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const Product_1 = __importDefault(require("../models/Product"));
const Cart_1 = __importDefault(require("../models/Cart"));
// Adding default user id is here we can 
const userId = new mongodb_1.ObjectId("62dc01d710236932557f3b6c");
const createCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let products = (_a = req.body) !== null && _a !== void 0 ? _a : null;
    try {
        if (!products || !Object.keys(products).length) {
            return res.send(400).json({ message: "No Product to add to a cart" });
        }
        // TODO: Quantity Check
        const productsData = yield Product_1.default.find({
            _id: {
                $in: Object.keys(products).map(id => new mongodb_1.ObjectId(id))
            },
            in_stock: true
        }).lean();
        if (productsData.length !== Object.keys(products).length) {
            return res.send(400).json({ message: "No Product to add to a cart" });
        }
        let productDataToSave = productsData.map(product => {
            return {
                productId: product._id,
                quantity: products[product._id].quantity,
                price: product.price
            };
        });
        const total_price = productDataToSave.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
        let cart = new Cart_1.default({
            items: productDataToSave,
            total_price,
            userId
        });
        yield cart.save();
        res.status(201).json({ status: true });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
const getCurrentActiveCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentCart = yield Cart_1.default.findOne({
            userId,
            // status: 0
        }).sort({ _id: -1 }).lean();
        if (!currentCart) {
            return res.send(404).json({ message: "No cart exists" });
        }
        const productsData = yield Product_1.default.find({
            _id: {
                $in: currentCart.items.map(item => item.productId)
            }
        }).lean();
        const cartItems = currentCart.items.map((item) => {
            const product = productsData.find(product => product._id.toString() === item.productId.toString());
            return Object.assign(Object.assign({}, item), { name: product === null || product === void 0 ? void 0 : product.name, sku: product === null || product === void 0 ? void 0 : product.sku });
        });
        const cartData = Object.assign(Object.assign({}, currentCart), { items: cartItems });
        res.status(200).json(cartData);
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});
const cartController = { createCart, getCurrentActiveCart };
exports.default = cartController;
