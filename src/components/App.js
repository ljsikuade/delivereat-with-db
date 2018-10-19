import React from "react";
import "../styles/App.scss";
import Cart from "./Cart";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      menu: [],
      orders: [],
      total: [],
      secondaryOrders: []
    };
    this.plusOrder = this.plusOrder.bind(this);
    this.minusOrder = this.minusOrder.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }
  componentDidMount() {
    fetch("/menu/")
      .then(res => res.json())
      .then(body => this.setState({ menu: body }));
  }

  plusOrder(foodItem) {
    let total = this.state.total;
    let orders = this.state.orders;
    let secOrders = this.state.secondaryOrders;
    //Does the fooditem already exist?
    if (total.find(e => e.name === foodItem.name)) {
      console.log("item exists, secondary added!");
      secOrders.push(foodItem.name);
      this.setState({ secondaryOrders: secOrders });
    } else {
      console.log("item does not exist, primary added!");
      orders.push(foodItem.name);
      this.setState({ orders: orders });
    }
    this.setState({ minusGrey: false });
  }

  minusOrder(foodItem) {
    if (total.find(e => e.name === foodItem.name)) {
    } else {
    }
  }

  addToCart(foodItem) {
    //add up number of instances of foodItem.name in orders array. Add to quantity.
    let total = this.state.total;
    let orders = this.state.orders;
    let secondaryOrders = this.state.secondaryOrders;
    let found = total.indexOf(total.find(name => name.name === foodItem.name));
    //Get the primary and secondary orders, and add them to the quantity for that spec food item
    let primaryQuant = orders.filter(primary => primary === foodItem.name)
      .length;
    //prettier-ignore
    let secondaryQuant = secondaryOrders.filter(secondary => secondary === foodItem.name).length;
    //Does the food item exist in total?
    if (found != -1) {
      foodItem.quantity += secondaryQuant;
      total[found] = foodItem;
    } else {
      foodItem.quantity = 0;
      foodItem.quantity += primaryQuant;
      total.push(foodItem);
    }
    this.setState({ total: total });
    console.log(total);
  }

  render() {
    console.log(this.state.orders);
    return (
      <div>
        <nav>
          <Cart total={this.state.total} />
        </nav>

        <ul>
          {this.state.menu.map(foodItem => (
            <li key={foodItem.id}>
              {foodItem.name} {foodItem.price}
              <button onClick={() => this.addToCart(foodItem)}>
                Add to Cart
              </button>{" "}
              <label>Quantity:</label>{" "}
              <button onClick={() => this.plusOrder(foodItem)}>+</button>
              <button
                disabled={
                  //false
                  !this.state.orders.includes(foodItem.name)
                }
                onClick={() => this.minusOrder(foodItem)}
              >
                -
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
