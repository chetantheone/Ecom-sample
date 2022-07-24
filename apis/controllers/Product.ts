import { Request, Response } from 'express';
import Product from '../models/Product';


const readAll = (req: Request, res: Response) => {

    let filter = {};
    if (req.query.available === 'yes') {
        filter = {
            in_stock: true
        }
    }

    return Product.find(filter).lean()
        .then((products) => res.status(200).json({ products }))
        .catch((error) => res.status(500).json({ error }));
};

const productController = { readAll };

export default productController;