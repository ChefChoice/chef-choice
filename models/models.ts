export interface Order {
  id: number;
  homechef_id: string;
  cons_id: string;
  status: string;
  schedtime?: Date; // TODO: make it not nullable when ready
  time: string;
  subtotal?: number;
  fees?: number;
  total?: number;
  cart?: boolean;
}

export interface Dish {
  dish_id: number;
  user_id: string;
  created_at?: string;
  dish_name: string;
  dish_price: number;
  dish_description?: string;
  dish_category?: string;
  dish_image?: string;
  dish_ingredients?: string;
}

export interface OrderDish {
  order_id: number;
  dish_id: number;
  quantity?: number;
}
