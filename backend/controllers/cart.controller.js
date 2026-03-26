const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError')

// Get cart 
exports.getCart = catchAsync(async (req, res, next)=>{
  const filter = req.user
    ? {user :req.user._id}
    : {session_id : req.headers['x-session-id']};

  const cart = await Cart.findOne(filter)
    .populate({path:'items.product', select:'name image_url price priceAfterDiscount stock_quantity'});

  if(!cart){
    return res.status(200).json({
      status:'success',
      data:{items: [], total_price:0}
    });
  }

  // Price change detection
  let priceChanged = false;
  const items = cart.items.map(item =>{
    const currentPrice = item.product.priceAfterDiscount || item.product.price;
    const hasChanged = currentPrice !== item.unit_price;
    if (hasChanged) priceChanged = true;
    return {
      ...item.toObject(),
      currentPrice,
      priceChanged: hasChanged
    };
  })

  res.status(200).json({
    status:'success',
    data: cart
  });
});

// add item to cart 
exports.addItemToCart = catchAsync(async(req, res, next)=>{
  const {productId , quantity = 1} = req.body;

  //Check if product exists and is not soft-deleted
  const product = await Product.findOne({_id : productId , is_deleted:false});
  if(!product){
    return next(new AppError('Product not found',404));
  }

  //Check if the requested quantity is available in stock
  if(product.stock_quantity < quantity){
    return next(new AppError('Not enough stock available' , 400));
  }

  // Determine the price
  const unit_price = product.priceAfterDiscount || product.price;

  // Define cart filter (User or Guest)
  const filter = req.user
    ? {user: req.user._id}
    : {session_id: req.headers['x-session-id']};

    let cart = await Cart.findOne(filter);

    if(!cart){
      // If no cart exists, create a new one
      cart = await Cart.create({
        ...filter,
        items:[{product:productId, quantity, unit_price}]
      });
    }else{
        // If cart exists, check if the product is already in the items array
        const itemIndex = cart.items.findIndex(
          item => item.product.toString() === productId
        );
        if(itemIndex > -1){
          // Product exists in cart, update the quantity
          cart.items[itemIndex].quantity += quantity;
        } else{
          // Product doesn't exist, push to items array
          cart.items.push({product:productId, quantity, unit_price});
        }
        await cart.save();
      }
    
    res.status(200).json({
      status:'success',
      data: cart
    });
});

// Remove item from cart 
exports.removeItemFromCart = catchAsync(async(req, res, next)=>{
  const {productId} = req.params;

  const filter = req.user
    ? {user: req.user._id}
    :{session_id: req.headers['x-session-id']};

  const cart = await Cart.findOne(filter);

  if(!cart){
    return next(new AppError('Cart not found' , 404));
  }

  // Remove product from items
  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();

  res.status(200).json({
    status: 'success',
    data : cart
  });
});

// update item quantity 
exports.updateItemQuantity = catchAsync(async(req, res, next)=>{
  const {productId} = req.params;
  const {quantity} = req.body;

  if(quantity < 1){
    return next(new AppError('Quantity must be at least 1',400));
  }

  const filter = req.user
    ?{user:req.user._id}
    :{session_id: req.headers['x-session-id']};

  const cart = await Cart.findOne(filter);

  if(!cart){
    return next(new AppError('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if(itemIndex === -1){
    return next(new AppError('Item not found', 404));
  }

  // Check stock availability
  const product = await Product.findById(productId);
  if(product.stock_quantity < quantity){
    return next (new AppError('Not enough stock available', 400));
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  
  res.status(200).json({
    status:'success',
    data:cart
  });
});

// clear cart 
exports.clearCart = catchAsync(async(req, res, next)=>{
  const filter = req.user
    ? {user: req.user._id}
    : {session_id: req.headers['x-session-id']};

    const cart = await Cart.findOne(filter);

    if(!cart){
      return next(new AppError('Cart not found', 404));
    }

    cart.items = []
    await cart.save();

    res.status(200).json({
      status:'success',
      message:'Cart cleared successfully'
    });
});

// Merge guest cart with user cart after he logedin 
exports.mergeCart = catchAsync(async(req, res, next)=>{
  const sessionId = req.headers['x-session-id'];
  if(!sessionId) return next();

  const guestCart = await Cart.findOne({session_id:sessionId});
  if(!guestCart || guestCart.items.length === 0) return next();

  let userCart = await Cart.findOne({user: req.user._id});

  if(!userCart){
    // If no user cart exists, convert the guest cart to a user cart
    guestCart.user = req.user._id;
    guestCart.session_id = null;
    await guestCart.save();
  } else{
    // If user has a cart, merge both carts
    guestCart.items.forEach(guestItem =>{
      const itemIndex = userCart.items.findIndex(
        item => item.product.toString() === guestItem.product.toString()
      );
      if (itemIndex > -1 ){
        userCart.items[itemIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });
    await userCart.save();
    await Cart.findByIdAndDelete(guestCart._id);
  }
  next()
  })