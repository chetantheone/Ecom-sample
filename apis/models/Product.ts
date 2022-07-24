import mongoose, { Document, Schema } from 'mongoose';

interface IProduct {
    sku: string;
    name: string;
    published: Boolean;
    short_description: string;
    description: string;
    in_stock?: Boolean;
    stock: number;
    image: string;
    price: number;
}

export interface IProductModel extends IProduct, Document { }

const ProductSchema: Schema = new Schema(
    {
        sku: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        published: Boolean,
        short_description: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        in_stock: {
            type: Boolean,
            default: false
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            default: 0
        },
        image: {
            type: String,
            default: null
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IProductModel>('Product', ProductSchema);
