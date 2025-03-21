export interface ICard {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
    selected: boolean;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}