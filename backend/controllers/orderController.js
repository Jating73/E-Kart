const Order = require('../models/orderModel')

// Create new order
// POST /api/orders
// Access  Private
const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({
      message:"No Order Items"
    })
    // throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
}

// Get order by ID
// GET /api/orders/:id
// Access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404).json({
      message:"Order not found"
    })
    // throw new Error('Order not found')
  }
}

// Update order to paid
// GET /api/orders/:id/pay
// Access  Private
const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404).json({
      message:"Order not found"
    })
    // throw new Error('Order not found')
  }
}

// Update order to delivered
// GET /api/orders/:id/deliver
// Access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if(order.isPaid == false){
      res.status(404).json({
        message: "Order Amount is not Paid Yet"
      });
      return;
    }else{
      order.isDelivered = true
      order.deliveredAt = Date.now()
  
      const updatedOrder = await order.save()
  
      res.json(updatedOrder);
    }
  } else {
    res.status(404).json({
      message: "Order not found"
    })
    // throw new Error('Order not found')
  }
}

// Get logged in user orders
// GET /api/orders/myorders
// Access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
}

// Get all orders
// GET /api/orders
// Access  Private/Admin
const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.json(orders)
}

module.exports= {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
