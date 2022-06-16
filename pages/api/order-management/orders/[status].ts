import type { NextApiRequest, NextApiResponse } from 'next';
import { setSession, getOrdersByStatus } from '../../utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async ({ user, isHomeChef }) => {
    switch (req.method) {
      case 'GET':
      default:
        const { status } = req.query;

        const orders = await getOrdersByStatus(status);

        return res.status(200).json({ orders });
    }
  });
};

export default handler;
