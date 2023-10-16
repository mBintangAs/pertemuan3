import mongoose, { Schema, Document, Model } from 'mongoose';
export interface FoodDoc extends Document {
    vendorId: string;
    name: string;
    description: string;
    foodType: string;
    category: string;
    readyTime: number;
    price: number;
    rating: number
    images: [string]
}
const FoodSchema = new Schema({
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    foodType: { type: String, required: true },
    category: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: { type: [String] }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    timestamps: true
})
export const Food = mongoose.model<FoodDoc>('food', FoodSchema)