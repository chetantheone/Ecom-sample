import mongoose, { Document, Schema } from 'mongoose';

interface ICart {
    items: [{
        productId: string,
        quantity: number,
        price: number
    }],
    total_price: number;
    userId: string,
    status?: 0
}

export interface ICartModel extends ICart, Document { }

const CartProduct = {
    productId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true
    },
};
const CartSchema: Schema = new Schema(
    {
        items: [CartProduct],
        total_price: {
            type: Number,
            default: 0
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        status: {
            type: Number,
            enum: [0, 1], // 0 active, 1 close
            default: 0
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<ICartModel>('Cart', CartSchema);
