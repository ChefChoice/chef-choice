import { useRouter } from 'next/router';
import { Dispatch, SetStateAction, useState } from 'react';
import { ORDER_TYPE } from '../../utils/constants';
import { Order } from '../../models/models';
import axios from 'axios';
import Modal from '../modals/Modal';

interface IOrderListProps {
  type: string;
  orders: Order[];
  isHomeChef: boolean | null;
  refresh: number;
  setRefresh: Dispatch<SetStateAction<number>>;
}

const OrderList = ({ type, orders, isHomeChef, refresh, setRefresh }: IOrderListProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [orderId, setOrderId] = useState<any | null>(null);
  const [status, setStatus] = useState<any | null>(null);

  const handleViewDetails = async (id: number) => {
    router.push(`/order-management/order/${id}`);
  };

  const handleReview = async (id: string) => {
    router.push(`/review/${id}`);
  };

  const handleClick = async (status: string, id: number) => {
    await axios
      .post(`/api/order-management/order/${id}`, { status })
      .then((response) => {
        if (response.data !== 200) {
          return response.data;
        }
      })
      .catch((err) => {
        console.error(err.message);
      });
    setShowModal(false);
    setRefresh(refresh + 1);
  };

  return (
    <div className="md:w-full">
      {orders.length != 0 ? (
        orders.map((order: Order, i: number) => {
          const time: Date = new Date(Date.parse(order.time));
          return (
            <div key={i} className="py-2 md:flex">
              <div className="mb-4 flex grow gap-5 md:mb-0">
                <div className="w-20 text-xl">{`#${order.id}`}</div>
                <div className="w-30 text-xl">{time.toDateString()}</div>
                <div className="w-20 text-xl">{`$${order.total?.toFixed(2)}`}</div>
              </div>
              <div className="ml-auto flex grow justify-end gap-x-3 py-2">
                <div
                  onClick={() => handleViewDetails(order.id)}
                  className="w-full max-w-fit cursor-pointer overflow-hidden rounded border-2 border-solid border-black shadow-lg hover:bg-green-hover hover:ring"
                >
                  <div className="py-2 px-2 text-center">
                    <a className="xs:text-x font-bold lg:text-base">View Details</a>
                  </div>
                </div>
                {type === ORDER_TYPE.PAST_ORDERS && (
                  <div
                    onClick={() => handleReview(order.homechef_id)}
                    className="w-full max-w-fit cursor-pointer overflow-hidden rounded border-2 border-solid border-black shadow-lg hover:bg-green-hover hover:ring"
                  >
                    <div className="py-2 px-2 text-center">
                      <a className="xs:text-x font-bold lg:text-base">Review</a>
                    </div>
                  </div>
                )}
                {isHomeChef && type === ORDER_TYPE.PENDING_ORDERS && (
                  <div
                    onClick={() => {
                      setStatus('O');
                      setOrderId(order.id);
                      setShowModal(true);
                    }}
                    className="hover:border-green w-full max-w-fit cursor-pointer overflow-hidden rounded border-2 border-solid border-green-light bg-green-light shadow-lg hover:bg-green-hover hover:ring"
                  >
                    <div className="py-2 px-2 text-center">
                      <a className="xs:text-x font-bold text-white lg:text-base">Accept Order</a>
                    </div>
                  </div>
                )}
                {isHomeChef && type === ORDER_TYPE.ONGOING_ORDERS && (
                  <div
                    onClick={() => {
                      setStatus('F');
                      setOrderId(order.id);
                      setShowModal(true);
                    }}
                    className="hover:border-green w-full max-w-fit cursor-pointer overflow-hidden rounded bg-green-light shadow-lg hover:bg-green-hover hover:ring"
                  >
                    <div className="py-2 px-2 text-center">
                      <a className="xs:text-x font-bold text-white lg:text-base">Fulfill Order</a>
                    </div>
                  </div>
                )}
                {type === ORDER_TYPE.PENDING_ORDERS && (
                  <div
                    onClick={() => {
                      setStatus('C');
                      setOrderId(order.id);
                      setShowModal(true);
                    }}
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
              <hr className="mt-4" />
            </div>
          );
        })
      ) : (
        <div>No records</div>
      )}
      <Modal
        visible={showModal}
        title={'Confirm Action'}
        content={
          <p className="mx-2 mb-4 break-all text-lg">Confirm action for Order #{orderId}?</p>
        }
        leftBtnText={'No'}
        leftBtnOnClick={async () => setShowModal(false)}
        rightBtnText={'Yes'}
        rightBtnOnClick={() => handleClick(status, orderId)}
        hideLeftBtn={false}
      />
    </div>
  );
};

export default OrderList;
