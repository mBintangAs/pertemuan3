import mongoose, { Schema, Document, Model } from 'mongoose';
export interface CustomerDoc extends Document {
    email: string,
    password: string,
    salt: string,
    firstName: string,
    lastName: string,
    address: string,
    phone: string,
    verified: boolean,
    otp: string,
    otp_expiry: Date,
    lat: number
    lng: number
}
const CustomerSchema = new Schema({
    email: { type: String, required: true ,unique:true},
    password: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, required: true },
    verified: { type: Boolean, require: true },
    otp: { type: String, require: true },
    otp_expiry: { type: Date, required: true },
    lat: {type:Number},
    lng: {type:Number}
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    timestamps: true
})


export const Customer = mongoose.model<CustomerDoc>('Customer', CustomerSchema)