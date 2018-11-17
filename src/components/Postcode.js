import React from "react";

class PostCode extends React.Component {
  constructor() {
    super();
    this.state = { value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit(event) {
    this.props.postCodeHandler(this.state.value);
    event.preventDefault();
    fetch(`http://api.postcodes.io/postcodes/${this.state.value}`)
      .then(response => response.json())
      .then(body =>
        this.props.calculateResult(body.result.longitude, body.result.latitude)
      );
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          value={this.state.value}
          onChange={this.handleChange}
          className="postcode__input"
        />
        <input
          onClick={this.handleClick}
          type="submit"
          value="Lock In"
          className="postcode__button"
        />
      </form>
    );
  }
}
export default PostCode;
