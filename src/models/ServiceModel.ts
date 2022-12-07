export interface Service{
    id?: string;
    name?: string;
    description?:string;
    categoryId?: string;
    specialtyId?:string;
    userId?: string;
    price?: string;
    address?: Address;
    schedule?: Schedule;
    isHomeService?: boolean;
    isActive: true;
}

export interface Address {
    city?: string;
    state?: string;
    zip?: string;
    address1?: string;
    address2?: string;
}

export interface Schedule{
    interval?: number;
    days?:any[]
}
export interface Hours{
    startHour?: string;
    endHour?: string;

}