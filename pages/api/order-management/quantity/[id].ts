import type { NextApiRequest, NextApiResponse } from 'next';
import { setSession, getOrderQuantity } from '../../utils';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async ({ user, isHomeChef }) => {
    const { id } = req.query;

    const quantity = await getOrderQuantity(id);

    return res.status(200).json({ quantity });
  });
};

export default handler;
