 import { WorkAddress } from './workAddress';


export interface Work { 
    name?: string;
    companyName?: string;
    position?: string;
    description?: string;
    phoneNumber?: string;
    phoneNumberSms?: boolean;
    emailAddress?: string;
    workAddress?: WorkAddress;
}
