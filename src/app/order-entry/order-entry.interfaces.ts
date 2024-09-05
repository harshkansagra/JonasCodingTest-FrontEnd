export interface PizzaMenuRow {
  topping?: PizzaTopping;
  small?: PizzaSize;
  medium?: PizzaSize;
  large?: PizzaSize;
  extraLarge?: PizzaSize;
  uniqueRow?: UniqueRow;
}

export interface UniqueRow {
  type: string;
  title: string;
}

export interface PizzaSize {
  name: string;
  displayName: string;
  price: number;
}

export interface PizzaTopping {
  name: string;
  price: number;
  largeCount: number;
}

export interface CreatedPizza {
  pizza: PizzaSize;
  toppings: PizzaTopping[];
  count: number;
  price: number;
  offerPrice: number;
  appliedOffer: number;
}
