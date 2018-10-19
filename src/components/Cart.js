import React from "react";

class Cart extends React.Component {
  constructor() {
    super();
    this.state = { toggleCart: false, currentId: 0, completedOrder: false };
    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }
  handleClick() {
    this.setState({ toggleCart: !this.state.toggleCart });
  }
  removeItem(foodItem) {
    console.log("remove" + foodItem.name);
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
        this.setState({ currentId: response.id, completedOrder: true })
      );
  }

  render() {
    return (
      <div>
        <p onClick={this.handleClick}>Cart</p>
        <label>{this.props.total.length}</label>

        {this.state.toggleCart && (
          <div>
            <ul>
              {this.props.total.map(foodItem => {
                return (
                  <li>
                    {foodItem.name} {foodItem.price * foodItem.quantity}
                    .00 X{foodItem.quantity}
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
              <p>{this.state.currentId}</p>
              {this.props.total.map(order => (
                <li>
                  {order.name} &nbsp; X{order.quantity} &nbsp; {order.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}
export default Cart;
