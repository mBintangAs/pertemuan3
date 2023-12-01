import { IsEmail, IsEmpty, Length, isEmail } from "class-validator";

export class CreateCustomerInput {

    @IsEmail()
    email: string;

    @Length(7, 12)
    phone: string;

    @Length(6, 12)
    password: string;
}
export interface customerPayload {
    _id: string,
    email: string,
    verified: boolean
}

export class loginCustomerInput {

    @IsEmail() email: string;

    @Length(6, 12)
    password: string;

}