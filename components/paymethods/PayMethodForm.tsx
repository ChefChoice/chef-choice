import Heading from '../../components/common/Heading';
import { useEffect, useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/outline';

interface IPayMethodFormProps {
  formName: string;
}

const PayMethodForm = ({ formName }: IPayMethodFormProps) => {
  return (
    <>
      <Heading title={formName} />
      <form action="/api/forms/paymethodForm" method="post">
        <div className="grid gap-y-10 text-lg">
          <div className="col-span-10 lg:col-span-7 lg:w-2/3 lg:pl-8">
            <div className="grid grid-rows-4 justify-items-center gap-5 text-center lg:justify-items-start lg:gap-4 lg:text-left">
              <div className="w-5/6 lg:w-1/2" title="Full Name">
                <div className="w-full">
                  <label htmlFor="fullname">Name on Card</label>
                  <div className="flex content-around justify-between rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover lg:p-2 lg:text-left">
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      className="w-full grow bg-gray-100 p-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="w-5/6 lg:w-2/3" title="Card Number">
                <label htmlFor="cardnumber">Card Number</label>
                <input
                  type="text"
                  id="cardnumber"
                  name="cardnumber"
                  className="w-full rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover focus:bg-white focus:outline-none lg:p-2 lg:text-left"
                />
              </div>
              <div className="flex w-5/6 gap-6 lg:w-2/3">
                <div className="flex-row" title="Exp Date">
                  <label htmlFor="expdate">Exp Date</label>
                  <input
                    type="text"
                    id="expdate"
                    name="expdate"
                    className="w-full rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover focus:bg-white focus:outline-none lg:p-2 lg:text-left"
                  />
                </div>
                <div className="w-1/2 flex-row" title="Security Code">
                  <label htmlFor="securitycode">Security Code</label>
                  <input
                    type="text"
                    id="securitycode"
                    name="securitycode"
                    className="w-full rounded border-2 border-x-0 border-t-0 border-gray-200 bg-gray-100 p-1 text-center hover:border-green-hover focus:border-green-hover focus:bg-white focus:outline-none lg:p-2 lg:text-left"
                  />
                </div>
              </div>

              <div
                className="row-span-2 h-12 w-1/4 place-content-center justify-center rounded bg-green-light pt-2 text-center text-white hover:bg-green-hover"
                title="Add Payment Method"
              >
                <button type="submit">Add Payment Method</button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default PayMethodForm;
