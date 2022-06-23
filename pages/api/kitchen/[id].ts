import type { NextApiRequest, NextApiResponse } from 'next';
import { setSession, getKitchen } from '../../../utils/supabase-admin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async ({ user, isHomeChef }) => {
    const { id } = req.query;

    const kitchen = await getKitchen(id);

    return res.status(200).json({ kitchen });
  });
};

export default handler;
