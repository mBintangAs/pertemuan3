import { customerPayload } from './costumer.dto';
import { vendorPayload } from './vendor.dto';
export type authPayload = vendorPayload | customerPayload;
