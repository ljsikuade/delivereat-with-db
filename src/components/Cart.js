import React from "react";

class Cart extends React.Component {
  constructor() {
    super();
    this.state = { toggleCart: false, currentId: 0, completedOrder: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.calculateTime = this.calculateTime.bind(this);
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
    let t = this.props.distance / 22.5;
    return t;
  }

  handleSubmit() {
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
  }
  //this.setState({ currentId: response.id, completedOrder: true })

  render() {
    console.log(this.state.completedOrder, this.props.distance);
    return (
      <div>
        <p onClick={this.handleClick}>Cart</p>{" "}
        <span className="counter">{this.props.total.length}</span>
        {this.state.toggleCart && (
          <div>
            <ul>
              {this.props.total.map(foodItem => {
                return (
                  <li key={foodItem.id}>
                    {foodItem.name} £{foodItem.price * foodItem.quantity}
                    .00 x{foodItem.quantity}
                    <button onClick={() => this.removeItem(foodItem)}>-</button>
                  </li>
                );
              })}
            </ul>
            <button onClick={this.handleSubmit}>Submit Order</button>
          </div>
        )}
        {this.state.completedOrder && (
          <div>
            <ul>
              <p>Order Id: {this.state.currentId}</p>
              {this.props.total.map(order => (
                <li>
                  {order.name} &nbsp; x{order.quantity} &nbsp; {order.price}
                </li>
              ))}
            </ul>
            <p>
              Your order will be with you in
              {this.calculateTime()}
            </p>
          </div>
        )}
      </div>
    );
  }
}
export default Cart;
