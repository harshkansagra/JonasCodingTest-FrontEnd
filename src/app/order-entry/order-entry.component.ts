import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CurrencyPipe } from '@angular/common';
import {
  CreatedPizza,
  PizzaSize,
  PizzaTopping,
  PizzaMenuRow,
} from './order-entry.interfaces';
import {
  pizzaSizes,
  vegToppings,
  nonVegToppings,
} from './order-entry.constants';

@Component({
  selector: 'app-order-entry',
  templateUrl: './order-entry.component.html',
  styleUrls: ['./order-entry.component.scss'],
})
export class OrderEntryComponent implements OnInit {
  finalOrder: CreatedPizza[] = [];
  pizzaTypes: PizzaSize[] = pizzaSizes;
  totalPrice: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    this.finalOrder = this.pizzaTypes.map((pizza) => ({
      pizza: pizza,
      toppings: [],
      count: 0,
      price: 0,
      offerPrice: 0,
      appliedOffer: 0,
    }));
  }

  checkAnyPizza(): boolean {
    return this.finalOrder.some((x) => x.count > 0);
  }

  displayedColumns: string[] = [
    'topping',
    'small',
    'medium',
    'large',
    'extraLarge',
  ];

  allOrderedPizzas: PizzaMenuRow[] = [
    { uniqueRow: { type: 'separator', title: 'Veg Toppings' } }, // Separator row
    ...this.generateToppingRows(vegToppings),
    { uniqueRow: { type: 'separator', title: 'Non-Veg Toppings' } }, // Separator row
    ...this.generateToppingRows(nonVegToppings),
    { uniqueRow: { type: 'separator', title: 'Total' } }, // Separator row
    ...this.generateTotalRows(),
  ];

  dataSource = new MatTableDataSource<PizzaMenuRow>(this.allOrderedPizzas);

  generateToppingRows(toppings: PizzaTopping[]): PizzaMenuRow[] {
    const sizeMap = pizzaSizes.reduce((acc, size) => {
      acc[size.name.replace(' ', '').toLowerCase()] = size;
      return acc;
    }, {} as { [key: string]: PizzaSize });

    return toppings.map((topping) => {
      return {
        topping,
        small: sizeMap['small'],
        medium: sizeMap['medium'],
        large: sizeMap['large'],
        extraLarge: sizeMap['extralarge'],
      };
    });
  }

  generateTotalRows(): PizzaMenuRow[] {
    const sizeMap = pizzaSizes.reduce((acc, size) => {
      acc[size.name.replace(' ', '').toLowerCase()] = size;
      return acc;
    }, {} as { [key: string]: PizzaSize });

    //add offer and final price rows
    let rows: PizzaMenuRow[] = [
      {
        uniqueRow: { type: 'offer', title: 'Offers' },
        small: sizeMap['small'],
        medium: sizeMap['medium'],
        large: sizeMap['large'],
        extraLarge: sizeMap['extralarge'],
      },
      {
        uniqueRow: { type: 'total', title: ' ' },
        small: sizeMap['small'],
        medium: sizeMap['medium'],
        large: sizeMap['large'],
        extraLarge: sizeMap['extralarge'],
      },
    ];

    return rows;
  }

  updatePizzaCount(index: number, isAdd: boolean) {
    if (isAdd) this.finalOrder[index].count += 1;
    else if (this.finalOrder[index].count > 1)
      this.finalOrder[index].count -= 1;
    else {
      this.finalOrder[index].toppings = [];
      this.finalOrder[index].count = 0;
      this.finalOrder[index].price = 0;
      this.finalOrder[index].offerPrice = 0;
      this.finalOrder[index].appliedOffer = 0;
    }

    this.updatePrices(index);
  }

  updateTopping(index: number, topping: PizzaTopping) {
    let currentPizza: CreatedPizza = this.finalOrder[index];
    let toppingIndex = this.finalOrder[index].toppings.findIndex(
      (t) => t.name === topping.name
    );
    if (toppingIndex >= 0) {
      // Remove the topping if it exists
      currentPizza.toppings.splice(toppingIndex, 1);
    } else {
      // Add the topping if it does not exist
      currentPizza.toppings.push(topping);
    }

    this.finalOrder[index].toppings = currentPizza.toppings;
    this.updatePrices(index);
  }

  updatePrices(index: number) {
    this.calculatePizzaPrice(index);
    this.calculateOfferPrice(index);
    this.totalPrice = 0;
  }

  checkPizzaTopping(index: number, topping: PizzaTopping): boolean {
    return this.finalOrder[index].toppings.some((t) => t.name === topping.name);
  }

  calculatePizzaPrice(index: number) {
    let currentPizza: CreatedPizza = this.finalOrder[index];

    let price: number = 0;
    price =
      currentPizza.pizza.price +
      currentPizza.toppings
        .map((x) => x.price)
        .reduce((sum, price) => sum + price, 0);

    this.finalOrder[index].price = price * currentPizza.count;
  }

  calculateOfferPrice(index: number) {
    let currentPizza: CreatedPizza = this.finalOrder[index];

    if (currentPizza.pizza.name === 'medium') {
      if (currentPizza.toppings.length === 2) {
        // Offer1 - with 2 toppings each medium pizza at $5
        this.finalOrder[index].offerPrice = currentPizza.count * 5;
        this.finalOrder[index].appliedOffer = 1;
        return;
      } else if (currentPizza.toppings.length === 4 && currentPizza.count > 1) {
        // Offer2 - with 2 toppings each 2 medium pizza at $9
        this.finalOrder[index].offerPrice =
          Math.floor(currentPizza.count / 2) * 9;
        // if odd pizza add single pizza with out disscount
        this.finalOrder[index].offerPrice +=
          currentPizza.count % 2 != 0
            ? currentPizza.price / currentPizza.count
            : 0;
        this.finalOrder[index].appliedOffer = 2;
        return;
      }
    } else if (currentPizza.pizza.name === 'large') {
      // Offer3 - 1 Large with 4 toppings, where certain toppings count more than once
      let totalToppingCount = 0;

      currentPizza.toppings.forEach((topping) => {
        totalToppingCount += topping.largeCount; // Use the largeCount property to determine how many "slots" this topping uses
      });

      if (totalToppingCount === 4) {
        this.finalOrder[index].offerPrice = currentPizza.price * 0.5; // Apply 50% discount
        this.finalOrder[index].appliedOffer = 3;
        return;
      }
    }

    //reset offer if no offer matches
    this.finalOrder[index].offerPrice = this.finalOrder[index].price;
    this.finalOrder[index].appliedOffer = 0;
    return;
  }

  calculateOrderTotal() {
    this.totalPrice = this.finalOrder.reduce(
      (total, order) => total + order.offerPrice,
      0
    );
  }
}
