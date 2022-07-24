"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(require("../models/Product"));
const readAll = (req, res) => {
    let filter = {};
    if (req.query.available === 'yes') {
        filter = {
            in_stock: true
        };
    }
    return Product_1.default.find(filter).lean()
        .then((products) => res.status(200).json({ products }))
        .catch((error) => res.status(500).json({ error }));
};
const productController = { readAll };
exports.default = productController;
