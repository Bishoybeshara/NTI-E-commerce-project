const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { authenticate } = require("../middlewares/auth.middleware");

// Middleware to identify the user if present, but not required
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next();
  }
  authenticate(req, res, next);
};

router.get("/", optionalAuth, cartController.getCart);
router.post("/add", optionalAuth, cartController.addItemToCart);
router.delete("/remove/:productId", optionalAuth, cartController.removeItemFromCart);
router.put("/update/:productId", optionalAuth, cartController.updateItemQuantity);
router.delete("/clear", optionalAuth, cartController.clearCart);

module.exports = router;
