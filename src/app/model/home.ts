 import { HomeAddress } from './homeAddress';


export interface Home { 
    name?: string;
    phoneNumber?: string;
    phoneNumberSms?: boolean;
    address?: HomeAddress;
}
