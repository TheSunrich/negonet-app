export interface Appointment{
    id?: string;
    dateStart?: Date;
    dateEnd?: Date;
    userProviderId?: string;
    userClientId?: string;
    serviceId?: string;
    serviceImageUrl?: string;
    serviceName?: string;
    servicePrice?: string;
    clientName?: string;
    isHomeService?: boolean;
    address?: AddressService;
    paymentType?: string;
    cardData?: CardData;
    age ?: number;
    information ?: string;

}

export interface AddressService{
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
}

export interface CardData{
    cardNumber?: string;
    dateExpire?: string;
    cvv?: string;
}