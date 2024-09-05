import { PizzaSize, PizzaTopping } from './order-entry.interfaces';

export const pizzaSizes: PizzaSize[] = [
  { name: 'small', displayName: 'Small', price: 5 },
  { name: 'medium', displayName: 'Medium', price: 7 },
  { name: 'large', displayName: 'Large', price: 8 },
  { name: 'extraLarge', displayName: 'Extra Large', price: 9 },
];

export const vegToppings: PizzaTopping[] = [
  { name: 'Tomatoes', price: 1.0, largeCount: 1 },
  { name: 'Onions', price: 0.5, largeCount: 1 },
  { name: 'Bell pepper', price: 1.0, largeCount: 1 },
  { name: 'Mushrooms', price: 1.2, largeCount: 1 },
  { name: 'Pineapple', price: 0.75, largeCount: 1 },
];

export const nonVegToppings: PizzaTopping[] = [
  { name: 'Sausage', price: 1.0, largeCount: 1 },
  { name: 'Pepperoni', price: 2.0, largeCount: 2 },
  { name: 'Barbecue chicken', price: 3.0, largeCount: 2 },
];
