export interface Profile { 
    revision?: number;
    phoneNumber?: string;
    confirmedPhone?: boolean;
    emailAddress?: string;
    confirmedEmail?: boolean;
    searchable?: boolean;
    available?: boolean;
    gps?: boolean;
    gpsTimestamp?: number;
    gpsLongitude?: number;
    gpsLatitude?: number;
}
