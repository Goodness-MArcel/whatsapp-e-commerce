import User from "./User.js";
import Store from "./Store.js";
import Product from "./Product.js";
import Admin from "./Admin.js";

/*
|--------------------------------------------------------------------------
| USER ↔ STORE (One-to-One)
|--------------------------------------------------------------------------
*/

User.hasOne(Store, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

Store.belongsTo(User, {
  foreignKey: "userId",
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

export { User, Store, Product , Admin};
