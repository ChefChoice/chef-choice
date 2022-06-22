import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { setSession, getOrder } from '../utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async ({ user, isHomeChef }) => {
    switch (req.method) {
      case 'POST':
        const { id } = req.body;
        const { data, error } = await supabase
          .from('Order')
          .update({ status: 'P', cart: false })
          .eq('id', id);

        return res.status(200).json({ message: 'success' });
      case 'GET':
      default:
        const orderId = await getOrder().then((order) => {
          if (order) {
            return order.id;
          } else return -1;
        });

        if (orderId && orderId !== -1) {
          let { data: order, error: OrderError } = await supabase
            .from('Order')
            .select(`*, "HomeChef" ("name")`)
            .eq('id', orderId);

          let { data: orderDish, error: OrderDishError } = await supabase
            .from('Order_Dish')
            .select(`*, "Dish" (dish_name, dish_price)`)
            .eq('order_id', orderId);

          if (OrderError) throw OrderError.message;
          if (OrderDishError) throw OrderDishError.message;

          return res.status(200).json({ order, orderDish });
        } else return res.status(200).json(orderId);
    }
  });
};

export default handler;
