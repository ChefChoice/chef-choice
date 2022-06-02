interface ICartItemProps {
  key: number;
  title: string;
  price: number;
  quantity?: number;
}

const CartItem = ({ key, title, price, quantity }: ICartItemProps) => {
  return (
    <div className="flex" key={key}>
      {quantity && <div>{quantity}</div>}
      <div className="grow">{title}</div>
      <div>${price}</div>
    </div>
  );
};

export default CartItem;
