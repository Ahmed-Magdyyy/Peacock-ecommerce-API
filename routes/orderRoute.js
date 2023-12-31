const express = require("express");

const {
  createCashOrder,
  createOnlinePaymentOrder,
  paymentWebhook,
  filterOrderForLoggedUser,
  findAllOrders,
  findSpecificOrder,
  findSpecificOrderByOrderNumber,
  updateOrderToDeliverd,
  updateOrdertoPaid,
  test,
} = require("../controllers/orderController");

const Router = express.Router();
const { protect, allowedTo } = require("../controllers/authController");

Router.post("/payments-webhook", paymentWebhook);

Router.route("/:cartId").post(protect, allowedTo("user"), createCashOrder);
Router.route("/payonline/:cartId").post(
  protect,
  allowedTo("user"),
  createOnlinePaymentOrder
);

Router.use(protect);

Router.get(
  "/",
  allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders
);

Router.get(
  "/ordernumber",
  allowedTo("user", "admin", "manager"),
  findSpecificOrderByOrderNumber
);
Router.get("/:id", allowedTo("user", "admin", "manager"), findSpecificOrder);

Router.put(
  "/:id/delivery",
  allowedTo("admin", "manager"),
  updateOrderToDeliverd
);
Router.put("/:id/pay", allowedTo("admin", "manager"), updateOrdertoPaid);

module.exports = Router;
