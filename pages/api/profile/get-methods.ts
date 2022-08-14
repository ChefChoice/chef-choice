import { getAllPaymentMethods, setSession } from '../../../utils/supabase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await setSession(req).then(async ({ user }) => {
    return getAllPaymentMethods({ uuid: user.id })
      .then((methods) => {
        return res.status(200).json(methods);
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

export default handler;
