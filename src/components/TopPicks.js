import React from "react";

class TopPicks extends React.Component {
  constructor() {
    super();
    this.state = { response: [], menu: [] };
  }
  componentDidMount() {
    console.log("this runs", this.props.menu);
    fetch("/top/")
      .then(response => response.json())
      .then(bod => this.setState({ response: bod }))
      .then(
        fetch("/menu/")
          .then(res => res.json())
          .then(body => this.setState({ menu: body }))
      );
  }

  render() {
    console.log("finally this: ", this.props.menu);
    return (
      <section className="top__picks">
        <h1 className="top__picks__header">Top Picks</h1>
        <ol className="top__picks__list">
          {this.state.response.map(resp =>
            this.state.menu.map(
              menuObj =>
                resp.menu_id === menuObj.id ? (
                  <li className="top__picks__item" key={menuObj.id}>
                    {menuObj.name}
                  </li>
                ) : null
            )
          )}
        </ol>
      </section>
    );
  }
}
export default TopPicks;
