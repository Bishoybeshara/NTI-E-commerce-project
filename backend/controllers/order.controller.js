const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const catchAsync = require('../utilities/catchAsync');
const AppError = require('../utilities/appError');
const mongoose = require ('mongoose')


const filterObj = (obj, ...allowedFields)=>{
  const newObj = {}
  Object.keys(obj).forEach(key =>{
    if(allowedFields.includes(key)) newObj[key] = obj[key];
  });
  return newObj;
};

// create order ->checkout
exports.createOrder = catchAsync (async (req, res, next) =>{
  const {phone , address} = req.body;

  // Get the user's cart
  const cart = await Cart.findOne({user: req.user._id})
    .populate('items.product' , 'name image_url price priceAfterDiscount stock_quantity')

  if(!cart || cart.items.length === 0){
    return next(new AppError('Your cart is empty' , 400));
  }
  // Start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try{
    // Deduct stock for each product
    for (const item of cart.items){
      const product = await Product.findOneAndUpdate(
        {_id: item.product , stock_quantity :{$gte : item.quantity} , is_deleted: false},
        {$inc:{stock_quantity: -item.quantity}},
        {new: true, session}
      );

      if(!product){
        throw new AppError(`Product ${item.product} is out of stock` , 400);
      }
    }
    // Create the order
    const order = await Order.create([{
      user: req.user._id,
      items: cart.items.map(item=>({
        product : item.product,
        name: item.product.name,
        image_url : item.product.image_url,
        quantity: item.quantity , 
        unit_price : item.unit_price
      })),
      total_amount : cart.total_price,
      phone,
      address
    }],{session});
    // Clear the cart
    cart.items = [];
    await cart.save({session});

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      status: 'success',
      data: order[0]
    });

  }catch (err){
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
});

// get my orders 
exports.getMyOrders = catchAsync(async(req, res, next)=>{
  const orders = await Order.find({user: req.user._id})
    .sort({createdAt: -1});

    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders
    });
});

// Get order by id
exports.getOrderById = catchAsync(async (req, res, next) =>{
  const order = await Order.findOne({
    _id: req.params.id , 
    user: req.user._id
  });

  if(!order){
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    status:'success',
    data: order
  });
});

// cancel order (user)
exports.cancelOrder = catchAsync(async(req, res, next)=>{
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if(!order){
    return next (new AppError('Order not found' , 404));
  }

  if(order.status !== 'pending'){
    return next(new AppError('You can only cancel pending orders', 400));
  }

  // Rollback stock (in case of failure or cancellation)
  for (const item of order.items){
    await Product.findByIdAndUpdate(
      item.product,
      {$inc:{stock_quantity: item.quantity}}
    );
  }
  
  order.status = 'cancelled_by_user';
  await order.save();

  res.status(200).json({
    status:'success',
    message:'Order cancelled successfully'
  });
});


// update order (user)    === pending 
exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.status !== 'pending') {
    return next(new AppError('You can only update pending orders', 400));
  }

  const {items } = req.body;
  const filteredBody = filterObj(req.body, 'phone', 'address');

  // Update phone and address
if (filteredBody.phone) order.phone = filteredBody.phone;
if (filteredBody.address) order.address = filteredBody.address;

  // Update quantities
  if (items && items.length > 0) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const updatedItem of items) {
        const orderItem = order.items.find(
          item => item.product.toString() === updatedItem.productId
        );

        if (!orderItem) {
          throw new AppError(`Product ${updatedItem.productId} not found in order`, 404);
        }

        const quantityDiff = updatedItem.quantity - orderItem.quantity;

        // Check stock if quantity increased
        if (quantityDiff > 0) {
          const product = await Product.findOneAndUpdate(
            { _id: updatedItem.productId, stock_quantity: { $gte: quantityDiff }, is_deleted: false },
            { $inc: { stock_quantity: -quantityDiff } },
            { new: true, session }
          );

          if (!product) {
            throw new AppError(`Not enough stock for product ${updatedItem.productId}`, 400);
          }
        } else if (quantityDiff < 0) {
          // Return stock if quantity decreased
          await Product.findByIdAndUpdate(
            updatedItem.productId,
            { $inc: { stock_quantity: Math.abs(quantityDiff) } },
            { session }
          );
        }

        orderItem.quantity = updatedItem.quantity;
      }

      // Recalculate total_amount
      order.total_amount = order.items.reduce(
        (acc, item) => acc + item.quantity * item.unit_price, 0
      );

      await order.save({ session });
      await session.commitTransaction();
      session.endSession();

    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return next(err);
    }
  } else {
    await order.save();
  }

  res.status(200).json({
    status: 'success',
    data: order
  });
});




// admin functions 

// get all orders (admin)
exports.getAllOrders = catchAsync(async(req, res, next)=>{
  const {status} = req.query;

  const filter = {};
  if(status) filter.status = status;

  const orders = await Order.find(filter)
    .populate('user' , 'name email phone')
    .sort({createdAt :-1});

  res.status(200).json({
    status:'success',
    results:orders.length,
    data: orders
  });
});

// update order status (admin)
exports.updateOrderStatus = catchAsync(async(req, res, next)=>{
  const {status} = req.body;

  const order = await Order.findById(req.params.id);

  if(!order){
    return next (new AppError('Order not found', 404));
  }




// Return stock only if the new status is a cancellation and the previous status was not a cancellatiion
if (
    ['rejected', 'cancelled_by_admin'].includes(status) &&
    !['rejected', 'cancelled_by_admin', 'cancelled_by_user'].includes(order.status)
  ) {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock_quantity: item.quantity } }
      );
    }
  }


  // // If the admin rejects the order, return stock
  // if (status === 'rejected') {
  //   for (const item of order.items) {
  //     await Product.findByIdAndUpdate(
  //       item.product,
  //       {$inc:{stock_quantity : item.quantity}}
  //     );
  //   }
  // }
  // // If the admin cancels the order, return stock
  // if (status == 'cancelled_by_admin'){
  //   for (const item of order.items){
  //     await Product.findByIdAndUpdate(
  //       item.product,
  //       {$inc: {stock_quantity : item.quantity}}
  //     );
  //   }
  // }

  order.status =status;
  await order.save();

  res.status(200).json({
    status:'success',
    data: order
  });
});
