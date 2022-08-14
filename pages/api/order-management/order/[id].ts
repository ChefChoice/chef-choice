import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../utils/supabaseClient';
import { setSession } from '../../../../utils/supabase-admin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await setSession(req).then(async ({ user, isHomeChef }) => {
      const { id } = req.query;

      switch (req.method) {
        case 'POST':
          const { status } = req.body;

          const { data, error: postError } = await supabase
            .from('Order')
            .update({ status })
            .eq('id', id);

          if (postError) throw postError;

          return res.status(200).json({ status });

        case 'GET':
        default:
          const { data: order, error: getError } = isHomeChef
            ? await supabase.from('Order').select('*, "Consumer" ("name")').eq('id', id)
            : await supabase.from('Order').select('*, "HomeChef" ("name")').eq('id', id);

          if (getError) throw getError;

          let { data: orderDish, error: OrderDishError } = await supabase
            .from('Order_Dish')
            .select(`*, "Dish" (dish_name, dish_price)`)
            .eq('order_id', order[0].id);

          if (OrderDishError) throw OrderDishError;

          return res.status(200).json({ order, orderDish });
      }
    });
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

export default handler;
