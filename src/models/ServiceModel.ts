export interface Service{
    id?: string;
    name?: string;
    description?:string;
    categoryId?: string;
    specialtyId?:string;
    userId?: string;
    price?: string;
    address?: Address;
}

export interface Address {
    city?: string;
    state?: string;
    zip?: string;
    address1?: string;
    address2?: string;
}

export interface schedule{
    interval?: number;
    days?:[{
        day?:string;
        hours?:hours;
    }]

}
export interface hours{
    startHour?: string;
    endHour?: string;

}