import type { NextApiRequest, NextApiResponse } from 'next';
import {
  setSession,
  addDish,
  deleteDish,
  createOrder,
  deleteOrder,
  getOrder,
  getOrderDishes,
  updateDishQuantity,
  updateTotals,
} from '../utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async ({ user, isHomeChef }) => {
    if (req.method === 'POST') {
      const { dishId, homeChefId, warning } = req.body;
      let order = await getOrder();

      let result = '';
      let warningResult = warning;
      let status = 201;

      // Check to see if the homechef id is the same as the one in the cart.
      if (order == null || order.length == 0) {
        // Create a new order and add a dish to the cart
        await createOrder(homeChefId, user.id);
        order = await getOrder();
        await addDish(order.id, dishId);
        await updateTotals(order);
        result = 'Created new order and added dish';
      } else {
        if (order.homechef_id === homeChefId) {
          // Check to see if the dish is already in OrderDish with the current order id.
          const dishArray = await getOrderDishes(order.id, dishId);

          if (dishArray.length !== 0) {
            // If it is then update the quantity of the dish
            await updateDishQuantity(dishArray[0], order.id, dishId);
            await updateTotals(order);
            result = 'Updating dish quantity';
          } else {
            await addDish(order.id, dishId);
            await updateTotals(order);
            result = 'Adding new dish';
          }
        } else {
          if (warningResult) {
            // Delete the current order and add a new order.
            await deleteOrder(order.id);
            await createOrder(homeChefId, user.id);
            order = await getOrder();
            await addDish(order.id, dishId);
            await updateTotals(order);
            warningResult = false;
            result = 'Cleared the cart and added new order with dish';
          } else {
            // If not, let the user know that adding this item will clear the cart.
            result = 'Warning that adding the new item will clear the cart';
            warningResult = true;
            status = 200;
          }
        }
      }

      return res.status(status).json({ result, warning: warningResult });
    } else if (req.method === 'DELETE') {
      const { dishId, orderId } = req.body;
      const data = await deleteDish(orderId, dishId);
      const orderDishes = await getOrderDishes(orderId);
      if (orderDishes.length === 0) {
        await deleteOrder(orderId);
      } else {
        const order = await getOrder();
        await updateTotals(order);
      }

      if (data) {
        return res.status(200).json({ message: 'Deleted item', orderDishes });
      } else {
        res.status(400);
      }
    }
  });
};

export default handler;
