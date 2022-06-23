import { useRouter } from 'next/router';
import { Dispatch, SetStateAction } from 'react';
import { ORDER_TYPE } from '../../utils/constants';
import { supabase } from '../../utils/supabaseClient';

interface IOrderListProps {
  type: string;
  orders: any[];
  isHomeChef: boolean | null;
  refresh: number;
  setRefresh: Dispatch<SetStateAction<number>>;
}

const OrderList = ({ type, orders, isHomeChef, refresh, setRefresh }: IOrderListProps) => {
  const router = useRouter();

  const handleViewDetails: any = async (id: any) => {
    router.push(`/order-management/order/${id}`);
  };

  const handleAccept: any = async (id: any) => {
    // TODO: Accept order make serverside
    const { data, error } = await supabase.from('Order').update({ status: 'O' }).eq('id', id);
    setRefresh(refresh + 1);
  };

  const handleCancel: any = async (id: any) => {
    // TODO: Cancel Order make serverside
    const { data, error } = await supabase.from('Order').update({ status: 'C' }).eq('id', id);
    setRefresh(refresh + 1);
  };

  const handleFulfill: any = async (id: any) => {
    // TODO: Fulfill Order make serverside
    const { data, error } = await supabase.from('Order').update({ status: 'F' }).eq('id', id);
    setRefresh(refresh + 1);
  };

  return (
    <div className="md:w-full">
      {orders.length != 0 ? (
        orders.map((order: any, i: number) => {
          const time: Date = new Date(Date.parse(order.time));

          return (
            <div key={i} className="flex gap-3 py-2">
              <div className="flex grow gap-5">
                <div className="w-20 text-xl">{`#${order.id}`}</div>
                <div className="w-30 text-xl">{time.toDateString()}</div>
                <div className="w-20 text-xl">{`$${order.total}`}</div>
              </div>
              <div
                onClick={() => handleViewDetails(order.id)}
                className="w-full max-w-fit cursor-pointer overflow-hidden rounded border-2 border-solid border-black shadow-lg hover:bg-green-hover hover:ring"
              >
                <div className="py-2 px-2 text-center">
                  <a className="xs:text-x font-bold lg:text-base">View Details</a>
                </div>
              </div>
              {isHomeChef && type === ORDER_TYPE.PENDING_ORDERS && (
                <div
                  onClick={() => handleAccept(order.id)}
                  className="hover:border-green w-full max-w-fit cursor-pointer overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:bg-green-hover hover:ring"
                >
                  <div className="py-2 px-2 text-center">
                    <a className="xs:text-x font-bold text-white lg:text-base">Accept Order</a>
                  </div>
                </div>
              )}
              {isHomeChef && type === ORDER_TYPE.ONGOING_ORDERS && (
                <div
                  onClick={() => handleFulfill(order.id)}
                  className="hover:border-green w-full max-w-fit cursor-pointer overflow-hidden rounded bg-green-light shadow-lg hover:bg-green-hover hover:ring"
                >
                  <div className="py-2 px-2 text-center">
                    <a className="xs:text-x font-bold text-white lg:text-base">Fulfill Order</a>
                  </div>
                </div>
              )}
              {type === ORDER_TYPE.PENDING_ORDERS && (
                <div
                  onClick={() => handleCancel(order.id)}
                  className="w-full max-w-fit cursor-pointer overflow-hidden rounded bg-red-500 shadow-lg hover:bg-black hover:ring"
                >
                  <div className="py-2 px-2 text-center">
                    <a className="xs:text-x font-bold text-white lg:text-base">
                      {isHomeChef ? `Reject Order` : `Cancel Order`}
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <div>No records</div>
      )}
    </div>
  );
};

export default OrderList;
