import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../utils/supabaseClient';
import { parseCookies } from 'nookies';
import { createOrRetrieveStripeCustomerID } from '../../../utils/supabase-admin';
import { stripe } from '../../../utils/stripe';

const setSession = async (req: NextApiRequest) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  const token = parseCookies({ req })['sb-access-token'];

  if (user) {
    supabase.auth.session = () => ({
      user: user,
      access_token: token,
      token_type: 'Bearer',
    });
    return user;
  } else {
    throw error;
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await setSession(req).then(async (user) => {
    createOrRetrieveStripeCustomerID({ uuid: user.id })
      .then((customerID) => {
        let expMonth = req.body.expdate.substring(0, 2);
        let expYear = req.body.expdate.substring(2, 6);

        stripe.paymentMethods
          .create({
            type: 'card',
            billing_details: {
              name: req.body.fullname,
            },
            card: {
              number: req.body.cardnumber,
              exp_month: expMonth,
              exp_year: expYear,
              cvc: req.body.securitycode,
            },
          })
          .then((paymentMethod) => {
            console.log('created!');
            stripe.paymentMethods
              .attach(paymentMethod.id, {
                customer: customerID,
              })
              .then((paymentMethod) => {
                console.log('attached!');
                stripe.customers
                  .update(customerID, {
                    invoice_settings: {
                      default_payment_method: paymentMethod.id,
                    },
                  })
                  .then(() => {
                    console.log('updated!');
                  });
              });
          })
          .catch((error) => {
            console.log(error);
          });
        return res.status(200).redirect('/profile');
      })
      .catch((error) => {
        console.error(error);
        return res.status(401).redirect('/');
      });
  });
};

export default handler;
