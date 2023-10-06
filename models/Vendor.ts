import mongoose,{Schema,Document,Model} from 'mongoose';
export interface VendorDoc extends Document{
    name:string;
    ownerName:string;
    foodType:[string];
    pincode:string;
    address:string;
    phone:string;
    email:string;
    password:string;
    salt:string;
    serviceAvailable:boolean;
    coverImage:[string];
    rating:number
}
const VendorSchema = new Schema({
    name:{type: String,required:true},
    ownerName:{type: String,required:true},
    foodType:{type: [String],required:true},
    pincode:{type: String,required:true},
    address:{type: String,required:true},
    phone:{type: String,required:true},
    email:{type: String,required:true},
    password:{type: String,required:true},
    salt:{type: String,required:true},
    serviceAvailable:{type:Boolean,required:true},
    coverImage:{type: [String],required:true},
    rating:{type:Number}
},{
    toJSON:{
        transform(doc,ret){
            delete ret.password;
            delete ret.salt;
            delete ret.coverImage;
            delete ret.createdAt;
            delete ret.updatedAt;
            delete ret.__v;
        }
    },
    timestamps:true
})
export const Vendor = mongoose.model<VendorDoc>('vendor',VendorSchema)