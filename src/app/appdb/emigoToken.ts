import { Emigo } from './emigo';
import { EmigoMessage } from './emigoMessage';

export interface EmigoToken { 
    emigoId: string;
    emigo: EmigoMessage;
    signature?: string;
    token: string;
}
