import User from "./User.js";
import Store from "./Store.js";
import Product from "./Product.js";
import Admin from "./Admin.js";
import Order from "./Order.js";

/*
|--------------------------------------------------------------------------
| USER ↔ STORE (One-to-One)
|--------------------------------------------------------------------------
*/

User.hasOne(Store, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "store",
});

Store.belongsTo(User, {
  foreignKey: "userId",
  as: "user", 
});

/*
|--------------------------------------------------------------------------
| STORE ↔ PRODUCT (One-to-Many)
|--------------------------------------------------------------------------
*/

Store.hasMany(Product, {
  foreignKey: "storeId",
  onDelete: "CASCADE",
});

Product.belongsTo(Store, {
  foreignKey: "storeId",
});

/*
|--------------------------------------------------------------------------
| STORE ↔ ORDER (One-to-Many)
|--------------------------------------------------------------------------
*/

Store.hasMany(Order, {
  foreignKey: "storeId",    
  onDelete: "CASCADE",       
  as: "orders",             
});

Order.belongsTo(Store, {
  foreignKey: "storeId",
  as: "store",
});


export { User, Store, Product , Admin, Order};
