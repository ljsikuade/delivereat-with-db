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
        <input value={this.state.value} onChange={this.handleChange} />
        <input onClick={this.handleClick} type="submit" value="Lock In" />
      </form>
    );
  }
}
export default PostCode;
