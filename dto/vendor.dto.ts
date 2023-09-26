export interface createVendorInput {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
}
export interface vendorLoginInput {
    email: string,
    password: string
}
export interface vendorRet {
    _id: string,
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean;
    coverImage: [string];
    rating: number
}
export interface vendorPayload {
    _id: string,
    email: string,
    name: string,
    foodType: [string]
}