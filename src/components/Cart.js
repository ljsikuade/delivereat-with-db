import React from "react";

class Cart extends React.Component {
  constructor() {
    super();
    this.state = { toggleCart: false, currentId: 0, completedOrder: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.calculateTime = this.calculateTime.bind(this);
    this.cancelOrder = this.cancelOrder.bind(this);
  }
  handleClick() {
    this.setState({ toggleCart: !this.state.toggleCart });
  }
  removeItem(foodItem) {
    let revisedTotal = this.props.total;
    const index = revisedTotal.indexOf(
      revisedTotal.find(el => el.name === foodItem.name)
    );
    revisedTotal.splice(index, 1);
    this.props.removeAffectState(revisedTotal);
  }

  calculateTime() {
    let t = (this.props.distance / 22.5).toFixed(2);
    let minutesOfTFull = t - Math.floor(t);
    let minutesOfTRestrained = minutesOfTFull.toFixed(2) * 100;
    if (t < 1) {
      return `${t * 100} minutes.`;
    } else {
      //needs tweaking. gives 0 each time because values are too smol
      return `${Math.floor(t)} hour(s) and ${minutesOfTRestrained} minutes.`;
    }
  }

  cancelOrder() {
    this.setState({ completedOrder: false });
    fetch(`/order/${this.state.currentId}`, {
      method: "DELETE",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(finalRes => console.log(finalRes.reply));
  }

  handleSubmit() {
    if (Object.keys(this.props.total).length === 0) {
      alert("You must order something first!");
    } else if (this.props.postCode) {
      fetch("/order/", {
        method: "POST",
        body: JSON.stringify(this.props.total),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => res.json())
        .then(response =>
          this.setState({
            currentId: response.id,
            completedOrder: true,
            toggleCart: false
          })
        );
    } else {
      alert("You must lock in a postcode!");
    }
  }

  //this.setState({ currentId: response.id, completedOrder: true })

  render() {
    console.log(this.state.currentId);
    return (
      <div className="cart">
        <span className="cart__prompt">
          <p onClick={this.handleClick}>Cart</p>{" "}
          <span className="counter">{this.props.total.length}</span>
        </span>
        {this.state.toggleCart && (
          <div>
            <ul className="cart__list">
              {this.props.total.map(foodItem => {
                return (
                  <li className="cart__list__item" key={foodItem.id}>
                    {foodItem.name} £{foodItem.price * foodItem.quantity}
                    .00 x{foodItem.quantity}
                    <button
                      className="cart__button"
                      onClick={() => this.removeItem(foodItem)}
                    >
                      -
                    </button>
                  </li>
                );
              })}
              <p className="cart__total">
                Total: £
                {this.props.total.reduce(
                  (acc, curr) => acc + curr.quantity * curr.price,
                  0
                  //curr.quantity * (acc.price + curr.price), 0
                )}
                .00
              </p>
            </ul>
            <button className="cart__submit" onClick={this.handleSubmit}>
              Submit Order
            </button>
          </div>
        )}
        {this.state.completedOrder && (
          <div className="completed__order">
            <div>Accepted! Sending order to {this.props.postCode}</div>
            <ul>
              <p>Order Id: {this.state.currentId}</p>
              {this.props.total.map(order => (
                <li className="completed__order_info" key={order.id}>
                  {order.name} &nbsp; x{order.quantity} &nbsp; £
                  {order.price * order.quantity}
                  .00
                </li>
              ))}
            </ul>
            <span className="completed__order__further">
              <p>
                Your order will be with you in &nbsp;
                {this.calculateTime()}
              </p>
              <button
                className="completed__order__submit"
                onClick={this.cancelOrder}
              >
                Cancel Order
              </button>
            </span>
          </div>
        )}
      </div>
    );
  }
}
export default Cart;
