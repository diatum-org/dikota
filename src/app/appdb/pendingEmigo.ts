import { EmigoMessage } from './emigoMessage';

export interface PendingEmigo { 
    emigoId?: string;
    shareId?: string;
    updated?: number;
    revision?: number;
    message?: EmigoMessage;
}

