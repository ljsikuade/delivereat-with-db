import App from "../src/components/App";
import Cart from "../src/components/Cart";
import React from "react";
import { shallow } from "enzyme";
global.fetch = require("jest-fetch-mock");

const Menu = {
  menu: [
    {
      id: 1,
      name: "Strawberry Cheesecake",
      price: 6
    },
    {
      id: 2,
      name: "Bakewell Tart",
      price: 4
    },
    {
      id: 3,
      name: "Pumpkin Pie",
      price: 5
    },
    {
      id: 4,
      name: "Merangue",
      price: 7
    }
  ]
};

/* 
This is too much work for the moment. 
I can't isolate a simple function because I need to invoke
a mock fetch etc.
*/

describe("Add to order", () => {
  // previous test skipped to save space
  test("adds to total array", () => {
    fetch.mockResponseOnce(JSON.stringify(Menu));
    const app = shallow(<App />);
    const cart = shallow(<Cart />);
    app.find("button-test").simulate("click");
    const text = cart.find("counter").text();
    expect(text).toEqual("56");
  });
});
