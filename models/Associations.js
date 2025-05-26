const sequelize = require("../config/db");
const User = require("./User");
const Category = require("./Category");
const SubCategory = require("./SubCategory");
const Product = require("./Product");
const Cart = require("./Cart");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Rating = require("./Ratings");
const Wishlist = require("./Wishlist");
const Contact = require("./ContactUs");
const InstaSection = require("./InstaSection");
const Video = require("./Video");

// Define associations
// User -> Cart (One-to-Many)
User.hasMany(Cart, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Cart.belongsTo(User, { foreignKey: "userId" });

// User -> Order (One-to-Many)
User.hasMany(Order, {
  foreignKey: "userId",
  onDelete: "SET NULL",
  onUpdate: "CASCADE",
});
Order.belongsTo(User, { foreignKey: "userId" });

// User -> Rating (One-to-Many)
User.hasMany(Rating, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rating.belongsTo(User, { foreignKey: "userId" });

// User -> Wishlist (One-to-Many)
User.hasMany(Wishlist, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Wishlist.belongsTo(User, { foreignKey: "userId" });

// Category -> SubCategory (One-to-Many)
Category.hasMany(SubCategory, {
  foreignKey: "cate_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
SubCategory.belongsTo(Category, { foreignKey: "cate_id" });

// Category -> Product (One-to-Many)
Category.hasMany(Product, {
  foreignKey: "categoryId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.belongsTo(Category, { foreignKey: "categoryId" });

// SubCategory -> Product (One-to-Many)
SubCategory.hasMany(Product, {
  foreignKey: "sub_cate_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Product.belongsTo(SubCategory, { foreignKey: "sub_cate_id" });

// Product -> Cart (One-to-Many)
Product.hasMany(Cart, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Cart.belongsTo(Product, { foreignKey: "productId" });

// Product -> OrderItem (One-to-Many)
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
OrderItem.belongsTo(Product, { foreignKey: "productId" });

// Product -> Rating (One-to-Many)
Product.hasMany(Rating, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Rating.belongsTo(Product, { foreignKey: "productId" });

// Product -> Wishlist (One-to-Many)
Product.hasMany(Wishlist, {
  foreignKey: "productId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Wishlist.belongsTo(Product, { foreignKey: "productId" });

// Order -> OrderItem (One-to-Many)
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

// Synchronize tables in the correct order
(async () => {
  try {
    // Sync independent tables first
    await Category.sync({ alter: true });
    await User.sync({ alter: true });
    await Contact.sync({ alter: true });
    await InstaSection.sync({ alter: true });
    await Video.sync({ alter: true });

    // Sync tables dependent on Category
    await SubCategory.sync({ alter: true });

    // Sync tables dependent on Category, SubCategory, and User
    await Product.sync({ alter: true });

    // Sync tables dependent on User and Product
    await Cart.sync({ alter: true });
    await Order.sync({ alter: true });
    await Rating.sync({ alter: true });
    await Wishlist.sync({ alter: true });

    // Sync tables dependent on Order and Product
    await OrderItem.sync({ alter: true });

    console.log("All tables synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing tables:", error);
  }
})();

module.exports = {
  sequelize,
  User,
  Category,
  SubCategory,
  Product,
  Cart,
  Order,
  OrderItem,
  Rating,
  Wishlist,
  Contact,
};
