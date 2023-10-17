const mongoose = require("mongoose");
const moment = require('moment-timezone');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Order must belong to a user"],
  },
  orderNumber: String,
  cartItems: [
    {
      productCategory: {
        type: String,
        enum: ["Cake", "ChocolateBox", "Tray", "Packages"],
        required: true,
      },
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "cartItems.productCategory",
      },
      variant: String,
      quantity: Number,
      price: Number,
    },
  ],
  shippingAddress: {
    name: String,
    details: String,
    city: String,
    state: String,
    phone: String,
  },
  shippingPrice: {
    type: Number,
    default: 0,
  },
  paymentMethod: {
    type: String,
    default: "cash on delivery",
  },
  totalorderPrice: Number,
  isPaid: {
    type: Boolean,
    default: false,
  },
  paidAt: Date,
  isDeliverd: {
    type: Boolean,
    default: false,
  },
  deliverdAt: Date,
  
},{timestamps: true});

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "_id name email phone" }).populate({
    path: "cartItems.productID",
    select:
      "_id title images description price discountedPrice categoryName categoryId",
  });
  next();
});


orderSchema.pre('save', function (next) {
  const currentTime = moment().tz('Africa/Cairo').format('YYYY-MM-DDTHH:mm:ss[Z]');

  this.createdAt = currentTime;
  this.updatedAt = currentTime;

  next();
});

orderSchema.pre('updateOne', function () {
  this.updateOne({}, { $set: { updatedAt: moment().tz('Africa/Cairo').format('YYYY-MM-DDTHH:mm:ss[Z]') } });
});

module.exports = mongoose.model("Order", orderSchema);
