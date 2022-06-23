export interface Order {
  id: number;
  homechef_id: string;
  cons_id: string;
  status: string;
  schedtime?: any;
  subtotal?: number;
  fees?: number;
  total?: number;
  cart?: boolean;
}

export interface Dish {
  dish_id: number;
  user_id: string;
  created_at?: any;
  dish_name: string;
  dish_price: string;
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
