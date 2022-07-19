import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { OrderDish } from '../../models/models';

interface ICartItemProps {
  key: number;
  title: string;
  price: string;
  quantity?: number;
  orderDish?: OrderDish;
  refresh?: any;
  setRefresh?: any;
}

const CartItem = ({ title, price, quantity, orderDish, refresh, setRefresh }: ICartItemProps) => {
  const handleClick = async () => {
    if (orderDish) {
      const dishId = orderDish.dish_id;
      const orderId = orderDish.order_id;

      axios
        .delete('/api/order-management/item', {
          data: {
            dishId,
            orderId,
          },
        })
        .then((response) => {
          if ((response.status = 200)) {
            setRefresh(refresh + 1);
          }
        });
    }
  };

  return (
    <div className="flex">
      {setRefresh && orderDish && (
        <div
          onClick={handleClick}
          className=" mr-2 w-8 cursor-pointer rounded-xl border-2 border-solid bg-red-500 text-center text-white hover:bg-black"
        >
          X
        </div>
      )}
      {quantity && (
        <div className="mr-2 w-8 rounded-sm border-2 border-solid text-center">{quantity}</div>
      )}
      <div className="mr-2">x</div>
      <div className="grow">{title}</div>
      <div>${price}</div>
    </div>
  );
};

export default CartItem;
