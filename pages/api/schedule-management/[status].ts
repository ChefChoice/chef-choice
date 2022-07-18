import type { NextApiRequest, NextApiResponse } from 'next';
import { setSession, getOrdersForCalendar } from '../../../utils/supabase-admin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async () => {
    const { status } = req.query;
    const orders = await getOrdersForCalendar(status as string[]);
    return res.status(200).json({ orders });
  });
};

export default handler;
