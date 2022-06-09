interface ICartItemProps {
  key: number;
  title: string;
  price: number;
  quantity?: number;
}

const CartItem = ({ key, title, price, quantity }: ICartItemProps) => {
  return (
    <div className="flex" key={key}>
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
