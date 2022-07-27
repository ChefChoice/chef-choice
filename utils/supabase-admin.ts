// ======= Server Functions Only ======
// Do not use on client side.

import { Order, OrderDish } from '../models/models';
import { supabase } from './supabaseClient';
import { NextApiRequest } from 'next';
import { parseCookies } from 'nookies';
import { stripe, clientDomain } from './stripe';
import Stripe from 'stripe';

export const setSession = async (req: NextApiRequest) => {
  const { user, error } = await supabase.auth.api.getUserByCookie(req);
  const token = parseCookies({ req })['sb-access-token'];

  if (user) {
    const isHomeChef = await checkHomeChef(user.id);

    supabase.auth.session = () => ({
      user: user,
      access_token: token,
      token_type: 'Bearer',
    });
    return { user, isHomeChef };
  } else {
    throw error;
  }
};

export const checkHomeChef = async (user: string) => {
  const { data: HomeChef, error } = await supabase.from('HomeChef').select('id').eq('id', user);

  return HomeChef?.length !== 0;
};

export const getOrder = async () => {
  const { data: pendingOrders, error: PendingOrderError } = await supabase
    .from('Order')
    .select('*')
    .eq('status', 'P');

  if (PendingOrderError) throw PendingOrderError.message;

  return pendingOrders.filter((order) => order.cart)[0];
};

export const createOrder = async (homeChefId: string, userId: string) => {
  try {
    const { data, error } = await supabase
      .from('Order')
      .insert([{ homechef_id: homeChefId, cons_id: userId }]);
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = async (orderId: number | string) => {
  try {
    const { data: OrderDish, error: OrderDishError } = await supabase
      .from('Order_Dish')
      .delete()
      .eq('order_id', orderId);
    const { data: Order, error: OrderError } = await supabase
      .from('Order')
      .delete()
      .match({ id: orderId });
  } catch (error) {
    throw error;
  }
};

export const updateTotals = async (order: Order) => {
  // Get the total amounts from OrderDish
  const { data: orderDishPrice, error: OrderDishPriceError } = await supabase
    .from('Order_Dish')
    .select(`*, "Dish" (dish_price)`)
    .eq('order_id', order.id);

  if (OrderDishPriceError) throw OrderDishPriceError.message;

  if (orderDishPrice) {
    let subtotal = 0;

    for (let i = 0; i < orderDishPrice.length; i++) {
      subtotal += orderDishPrice[i].quantity * orderDishPrice[i].Dish.dish_price;
    }

    // Update the cart totals
    subtotal = Math.round(subtotal * 100) / 100;
    const fees = Math.round(0.13 * subtotal * 100) / 100;
    const total = Math.round((subtotal + fees) * 100) / 100;

    const { data: subtotalUpdated, error: subtotalError } = await supabase
      .from('Order')
      .update({ subtotal, fees, total })
      .eq('id', order.id);

    if (subtotalError) throw subtotalError.message;
  }
};

export const getOrderDishes = async (orderId: number | string, dishId?: string) => {
  const { data: orderDishes, error: OrderDishError } = dishId
    ? await supabase.from('Order_Dish').select('*').eq('order_id', orderId).eq('dish_id', dishId)
    : await supabase.from('Order_Dish').select('*').eq('order_id', orderId);

  if (OrderDishError) throw OrderDishError.message;

  return orderDishes;
};

export const updateDishQuantity = async (
  dish: OrderDish,
  orderId: number | string,
  dishId: string
) => {
  const quantity = dish.quantity ? dish.quantity + 1 : 1;

  const { data: updateDish, error: updateDishError } = await supabase
    .from('Order_Dish')
    .update({ quantity: quantity })
    .eq('order_id', orderId)
    .eq('dish_id', dishId);

  if (updateDishError) throw updateDishError.message;
};

export const addDish = async (orderId: number | string, dishId: string) => {
  const { data, error } = await supabase
    .from('Order_Dish')
    .insert([{ order_id: orderId, dish_id: dishId, quantity: 1 }]);
};

export const deleteDish = async (orderId: number | string, dishId: string) => {
  try {
    const { data, error } = await supabase
      .from('Order_Dish')
      .delete()
      .eq('order_id', orderId)
      .eq('dish_id', dishId);

    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getOrdersByStatus = async (status: string | string[]) => {
  try {
    const { data: orders, error: OrderError } = await supabase
      .from('Order')
      .select('*')
      .eq('status', status);

    if (OrderError) throw OrderError.message;

    return orders;
  } catch (err) {
    throw err;
  }
};

export const getKitchen = async (chefId: string | string[]) => {
  const { data: HomeChef, error: HomeChefError } = await supabase
    .from('HomeChef')
    .select('*')
    .eq('id', chefId);

  if (HomeChefError) throw HomeChefError.message;

  const { data: Dishes, error: DishesError } = await supabase
    .from('Dish')
    .select('*')
    .eq('user_id', chefId);

  if (DishesError) throw DishesError.message;

  const { publicURL: PublicURL, error: PublicURLError } = supabase.storage
    .from('dish-images')
    .getPublicUrl('');
  if (PublicURLError) throw PublicURLError.message;

  return { HomeChef, Dishes, PublicURL };
};

export async function getOrderQuantity(orderId: number | string | string[]) {
  try {
    let { data: orderDish, error: OrderDishError } = await supabase
      .from('Order_Dish')
      .select(`*, "Dish" (dish_name, dish_price)`)
      .eq('order_id', orderId);

    if (OrderDishError) throw OrderDishError.message;

    let quantity = 0;

    orderDish?.forEach((dish) => {
      quantity += dish.quantity;
    });

    return quantity;
  } catch (err) {
    throw err;
  }
}

export const getOrdersForCalendar = async (status: string[]) => {
  try {
    const { data: orders, error: OrderError } = await supabase
      .from('Order')
      .select('id, schedtime, status, Consumer (name)')
      .or(`status.in.(${status})`);

    if (OrderError) throw OrderError.message;

    return orders;
  } catch (err) {
    throw err;
  }
};

// ===== Stripe Functions =====

export const createOrRetrieveStripeChef = async ({
  email,
  uuid,
  user, // TODO: Prefill details from the Chef sign up
}: {
  email: string;
  uuid: string;
  user?: any;
}) => {
  const { data, error } = await supabase
    .from('TestStripe')
    .select('stripe_id')
    .eq('id', uuid)
    .single();
  if (error) {
    // No customer record found, let's create one.
    // Create a Stripe Connect Account
    const customerData: Stripe.AccountCreateParams = {
      metadata: {
        supabaseUUID: uuid,
      },
      type: 'express',
      country: 'CA',
      business_type: 'individual',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    };
    if (email) customerData.email = email;
    const customer = await stripe.accounts.create(customerData);
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabase
      .from('TestStripe')
      .insert([{ id: uuid, stripe_id: customer.id }]);
    if (supabaseError) throw supabaseError;
    console.log(`New customer created and inserted for ${uuid}.`);

    const accountLink = await stripe.accountLinks.create({
      account: customer.id,
      refresh_url: `${clientDomain}/reauth`,
      return_url: `${clientDomain}/sign-up/success`,
      type: 'account_onboarding',
    });

    return accountLink.url;
  } else {
    // Create a Stripe Express Dashboard Login Link
    const link = await stripe.accounts.createLoginLink(data.stripe_id);

    return link.url;
  }
};
