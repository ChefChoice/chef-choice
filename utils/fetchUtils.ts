import { supabase } from './supabaseClient';

const getOrders = async () => {
  let { data: pendingOrders, error: PendingOrderError } = await supabase
    .from('Order')
    .select('*')
    .eq('status', 'P');

  if (PendingOrderError) throw PendingOrderError.message;

  let { data: ongoingOrders, error: OrderError } = await supabase
    .from('Order')
    .select('*')
    .eq('status', 'O');

  if (OrderError) throw OrderError.message;

  let { data: pastOrders, error: PastOrderError } = await supabase
    .from('Order')
    .select('*')
    .eq('status', 'F');

  if (PastOrderError) throw PastOrderError.message;

  return { pendingOrders, ongoingOrders, pastOrders };
};

const getKitchen = async (chefId: any) => {
  let { data: HomeChef, error: HomeChefError } = await supabase
    .from('HomeChef')
    .select('*')
    .eq('id', chefId);

  if (HomeChefError) throw HomeChefError.message;

  let { data: Dishes, error: DishesError } = await supabase
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

export { getOrders, getKitchen };
