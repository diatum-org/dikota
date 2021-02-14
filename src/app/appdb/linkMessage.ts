import { EmigoMessage } from './emigoMessage';

export interface LinkMessage { 
    emigo: EmigoMessage;
    signature: string;
    create?: string;
    attach?: string;
}
