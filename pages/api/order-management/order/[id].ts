import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../utils/supabaseClient';
import { setSession } from '../../../../utils/supabase-admin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await setSession(req).then(async ({ user, isHomeChef }) => {
      const { id } = req.query;

      const { data: order, error } = isHomeChef
        ? await supabase.from('Order').select('*, "Consumer" ("name")').eq('id', id)
        : await supabase.from('Order').select('*, "HomeChef" ("name")').eq('id', id);

      if (error) throw error;

      let { data: orderDish, error: OrderDishError } = await supabase
        .from('Order_Dish')
        .select(`*, "Dish" (dish_name, dish_price)`)
        .eq('order_id', order[0].id);

      if (OrderDishError) throw OrderDishError;

      return res.status(200).json({ order, orderDish });
    });
  } catch (err: any) {
    return res.status(404).json({ message: err.message });
  }
};

export default handler;
