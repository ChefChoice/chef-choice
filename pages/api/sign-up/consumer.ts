import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { data } = req.body;

      // Adding user to Supabase
      const {
        user,
        session,
        error: userError,
      } = await supabase.auth.signUp(
        { email: data.email, password: data.password },
        {
          data: {
            type: 'consumer',
            name: data.firstName.concat(' ', data.lastName),
          },
        }
      );

      if (userError) throw Error('Could not sign up user');

      return res.status(200).json({ user });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default handler;
