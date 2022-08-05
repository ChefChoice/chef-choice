import { detachPaymentMethod, setSession } from '../../../utils/supabase-admin';
import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await setSession(req).then(async () => {
    return detachPaymentMethod({ paymentMethodID: req.body.paymentMethodID })
      .then(() => {
        return res.status(200).json({});
      })
      .catch((error) => {
        console.log(error);
      });
  });
};

export default handler;
