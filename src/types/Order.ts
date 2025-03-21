export interface IOrderDetails {
    address: string;
    payment: string;
}
  
export interface IOrder {
    items: string[];
    payment: string;
    total: number;
    address: string;
    email: string;
    phone: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
