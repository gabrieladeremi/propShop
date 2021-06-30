import expressAsyncHandler from 'express-async-handler'
import Order from '../model/orderModel.js'

//@desc     create a new order
//@route    POST/api/orders
//@access   Private
const addOrderItems = expressAsyncHandler(async (req, res) => {
  console.log('i was hit')
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      totalPrice,
      shippingPrice,
    } = req.body

    if (orderItems && orderItems.length === 0) {
      res.status(400)
      throw new Error('no order items')
      return
    } else {
      const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
        shippingPrice,
      })

      const createdOrder = await order.save()

      if (createdOrder) {
        res.status(201).send(createdOrder)
        return
      } else {
        res.status(400).send({ message: 'order not created' })
      }
    }
  } catch (err) {
    console.log(err.message)
  }
})

//@desc     get order
//@route    GET/api/orders/:id
//@access   Private xl1yh/JLK'ip    .lp;  .

const getOrderById = expressAsyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    )

    if (order) {
      res.json(order)
    } else {
      res.status(404)
      throw new Error('order not found')
      return
    }
  } catch (error) {
    console.log(error)
  }
})

export { addOrderItems, getOrderById }
