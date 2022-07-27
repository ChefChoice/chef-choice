import { PROMPT } from '../../utils/constants';

interface IOrderModalProps {
  setModalOn: any;
  setChoice: any;
  setWarning?: any;
  title?: string | null;
  price?: number;
  description?: string;
  prompt?: string;
}

export default function OrderModal({
  setModalOn,
  setChoice,
  setWarning,
  title,
  price,
  description,
  prompt = 'Add to Order?',
}: IOrderModalProps) {
  const handleOKClick = () => {
    setChoice(true);
    setModalOn(false);
  };

  const handleWarningClick = () => {
    setWarning(true);
    setChoice(true);
    setModalOn(false);
  };

  const handleCancelClick = () => {
    setChoice(false);
    setModalOn(false);
  };

  return (
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-black bg-opacity-20">
      <div className="m-3 flex flex-col rounded-lg border-2 border-solid bg-white p-3 sm:w-1/3">
        <h1 className="text-center text-xl font-semibold">{title}</h1>
        <hr className="mb-6 mt-3 border-t-2 border-black/[.50]" />

        <div className="flex flex-col place-items-center">
          {price && <div className="mb-10 flex justify-center">{`$${price.toFixed(2)}`}</div>}
          {description && <div className="mb-10 flex justify-center">{description}</div>}
          <div
            className={`mb-10 flex justify-center ${prompt === PROMPT.WARNING && 'bg-yellow-400'}`}
          >
            {prompt}
          </div>

          <div className="flex justify-center">
            <button
              onClick={prompt === PROMPT.WARNING ? handleWarningClick : handleOKClick}
              className="mx-3 rounded bg-green-light px-5 py-1 text-white hover:bg-green-hover hover:ring hover:ring-green-500"
            >
              Yes
            </button>
            <button
              onClick={handleCancelClick}
              className="mx-3 rounded bg-red-700 px-5 py-1 text-white hover:bg-red-500 hover:ring hover:ring-red-400"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
