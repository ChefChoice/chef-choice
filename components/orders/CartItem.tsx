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
        <div className="border-solid rounded-sm border-2 text-center w-8 mr-2">{quantity}</div>
      )}
      <div className="mr-2">x</div>
      <div className="grow">{title}</div>
      <div>${price}</div>
    </div>
  );
};

export default CartItem;
