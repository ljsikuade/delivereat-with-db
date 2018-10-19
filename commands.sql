CREATE TABLE menu (
id serial,
name text not null,
price int not null,
PRIMARY KEY (id)
)

create table orders (
id serial,
PRIMARY KEY(id)
)

CREATE TABLE menu_orders (
id serial,
menu_id INT,
order_id INT,
quantity INT,
PRIMARY KEY (id),
FOREIGN KEY (menu_id) REFERENCES menu (id),
FOREIGN KEY (order_id) REFERENCES orders (id)
);