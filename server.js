require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const pgp = require("pg-promise")();

app.use(bodyParser.json());
app.use("/static", express.static("static"));
app.set("view engine", "hbs");

const db = pgp({
  host: "localhost",
  port: 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});

app.get("/", (req, res) => {
  res.render("index");
});
//Get the entire menu.
app.get("/menu/", (req, res) => {
  db.any(`SELECT * FROM menu`)
    .then(data => res.json(data))
    .catch(function(error) {
      res.status(500).send("Oh dear. Something went wrong:" + error);
    });
});
//Get all orders for a particular order id.
app.get("/order/:id", (req, res) => {
  db.any(
    `SELECT menu.name, menu_orders.quantity, menu.price, menu_orders.order_id 
     FROM menu, menu_orders, orders
     WHERE orders.id = $1 AND menu_orders.order_id = $1 AND menu.id = menu_orders.menu_id;`,
    [req.params.id]
  )
    .then(data => res.json(data))
    .catch(function(error) {
      res.status(500).send("Oh dear. Something went wrong:" + error);
    });
});

//Top picks
app.get("/top/", (req, res) => {
  db.any(`SELECT menu_id, COUNT(*) FROM menu_orders GROUP BY menu_id;`)
    .then(data => res.json(data))
    .catch(function(error) {
      res.status(500).send("Oh dear. Something went wrong:" + error);
    });
});

//Add a new order to the database under a single order id.
app.post("/order/", (req, res) => {
  console.log(req.body);
  db.one(`INSERT INTO orders VALUES (DEFAULT) RETURNING id`)
    .then(data => {
      req.body.forEach(order =>
        db.any(
          `INSERT INTO menu_orders (menu_id, order_id, quantity) VALUES ($1, $2, $3)`,
          [order.id, data.id, order.quantity]
        )
      );
      return data;
    })
    .then(results => res.json(results))
    .catch(function(error) {
      res.status(500).send("Oh dear. Something went wrong:" + error);
    });
});
/* SELECT menu.name, menu_orders.quantity, menu.price, menu_orders.order_id 
     FROM menu, menu_orders, orders
     WHERE orders.id = $1 AND menu_orders.order_id = $1 AND menu.id = menu_orders.menu_id;*/
//Remove an order from the database under a single order id
app.delete("/order/:id", (req, res) => {
  //first delete from the join table.
  db.none(`DELETE FROM menu_orders WHERE order_id = $1`, [req.params.id])
    .then(() => db.none(`DELETE FROM orders WHERE id = $1`, [req.params.id]))
    .then(() => res.json({ reply: "Order deleted" }))
    .catch(function(error) {
      res.status(500).send("Oh dear. Something went wrong:" + error);
    });
});

app.listen(8080, function() {
  console.log("Listening on port 8080");
});
