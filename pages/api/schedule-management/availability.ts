import type { NextApiRequest, NextApiResponse } from 'next';
import { setSession, createAvailability } from '../../../utils/supabase-admin';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await setSession(req);

  try {
    if (req.method === 'POST') {
      await createAvailability(user.id, req.body.availability);
    }

    res.status(200).json({ message: 'Successfully Added Availability' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

export default handler;
