import React from "react";
import "../styles/App.scss";
import Cart from "./Cart";
import Postcode from "./PostCode";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      menu: [],
      orders: [],
      total: [],
      secondaryOrders: [],
      distance: 0,
      postcode: ""
    };
    this.plusOrder = this.plusOrder.bind(this);
    this.minusOrder = this.minusOrder.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.removeAffectState = this.removeAffectState.bind(this);
    this.calculateResult = this.calculateResult.bind(this);
    this.finalValues = this.finalValues.bind(this);
    this.postCodeHandler = this.postCodeHandler.bind(this);
  }
  componentDidMount() {
    fetch("/menu/")
      .then(res => res.json())
      .then(body => this.setState({ menu: body }));
  }

  removeAffectState(editedArray) {
    this.setState({ total: editedArray });
  }

  calculateResult(long, lat) {
    fetch(`http://api.postcodes.io/postcodes/EC1R0ND`)
      .then(response => response.json())
      .then(body =>
        this.finalValues(long, lat, body.result.longitude, body.result.latitude)
      );
  }

  finalValues(custLong, custLat, ourLong, ourLat) {
    if (typeof Number.prototype.toRad === "undefined") {
      Number.prototype.toRad = function() {
        return (this * Math.PI) / 180;
      };
    }
    //I have no confidence in these calculations.
    let R = 6371e3; // metres
    let custLatitude = custLat.toRad();
    let ourLatitude = ourLat.toRad();
    //lat2 is our lat, lat 1 is customers
    let latMinusLatRadians = (ourLat - custLat).toRad();
    let lonMinusLonRadians = (ourLong - custLong).toRad();

    let a =
      Math.sin(latMinusLatRadians / 2) * Math.sin(latMinusLatRadians / 2) +
      Math.cos(ourLatitude) *
        Math.cos(custLatitude) *
        Math.sin(lonMinusLonRadians / 2) *
        Math.sin(lonMinusLonRadians / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance = R * c;
    this.convert(distance);
  }

  postCodeHandler(postCode) {
    if (postCode.length > 6) {
      this.setState({ postcode: postCode });
    }
  }

  convert(dist) {
    this.setState({ distance: (dist / 1000).toFixed(2) });
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
  //Currently does not minus from subsequent orders
  minusOrder(foodItem) {
    let orders = this.state.orders;
    let found = orders.indexOf(orders.find(e => e === foodItem.name));
    if (found != -1) {
      orders.splice(found, 1);
      console.log(orders.length);
      this.setState({ orders: orders });
    } else {
      alert("Something went wrong!");
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
          <Cart
            postCode={this.state.postcode}
            distance={this.state.distance}
            total={this.state.total}
            removeAffectState={this.removeAffectState}
          />
        </nav>
        <p>Enter your postcode:</p>
        <Postcode
          postCodeHandler={this.postCodeHandler}
          calculateResult={this.calculateResult}
        />
        <ul>
          {this.state.menu.map(foodItem => (
            <li key={foodItem.id}>
              {foodItem.name} {foodItem.price}
              <button
                className="button-test"
                onClick={() => this.addToCart(foodItem)}
              >
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
