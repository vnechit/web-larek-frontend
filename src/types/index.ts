export type CategoryType = 'другое' | 'софт-скил' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type CategoryMapping = {
  [Key in CategoryType]: string;
};

export interface ApiResponse {
  items: IProduct[];
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CategoryType;
  price: number | null;
  selected: boolean;
}
