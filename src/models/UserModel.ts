export interface User {
    uid?: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    curp?: string;
    isService?: boolean;
    password?: string;
    imageUrl?: string;
    address?: Address,
    phone?: string;
    birthDay?: any;
    processCompleted?: boolean;
    backgroundColor?: string;
}

export interface Address {
    city?: string;
    state?: string;
    zip?: string;
    address1?: string;
    address2?: string;
}