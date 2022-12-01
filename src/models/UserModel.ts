export interface User {
    id?: number;
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
    birthDay?: Date;

}

export interface Address {
    city?: string;
    state?: string;
    country?: string;
    zip?: string;
    street?: string;
    number?: string;
    suburb?: string;
}