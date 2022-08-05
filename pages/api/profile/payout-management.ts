import { createOrRetrieveStripeAccount, setSession } from '../../../utils/supabase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async ({ user }) => {
    if (req.method === 'GET') {
      try {
        if (!user) throw Error('Could not get user');
        console.log(user);

        // Retrieving link from Stripe
        const customerUrl = await createOrRetrieveStripeAccount({
          uuid: user.id || '',
          email: user.email || '',
        });

        if (!customerUrl) throw Error('Could not get customer');

        return res.status(200).json({ customerUrl });
      } catch (err: any) {
        console.log(err);
        res.status(500).json({ error: { statusCode: 500, message: err.message } });
      }
    } else {
      res.setHeader('Allow', 'GET');
      res.status(405).end('Method Not Allowed');
    }
  });
};

export default handler;
