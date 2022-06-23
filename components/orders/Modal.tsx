import { PROMPT } from '../../utils/constants';

interface IModalProps {
  setModalOn: any;
  setChoice: any;
  setWarning?: any;
  title?: string | null;
  price?: number;
  description?: string;
  prompt?: string;
}

export default function Modal({
  setModalOn,
  setChoice,
  setWarning,
  title,
  price,
  description,
  prompt = 'Add to Order?',
}: IModalProps) {
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
    <div className="fixed inset-0 z-40">
      <div className="fixed inset-0 z-40 bg-slate-400 opacity-80"></div>
      <div className="flex h-screen items-center justify-center">
        <div className="z-50 flex-col justify-center border-2 border-black bg-white py-12 px-24">
          <div className="mb-10 flex justify-center text-lg">{title}</div>
          {price && <div className="mb-10 flex justify-center">{price}</div>}
          {description && <div className="mb-10 flex justify-center">{description}</div>}
          <div
            className={`mb-10 flex justify-center ${prompt === PROMPT.WARNING && 'bg-yellow-400'}`}
          >
            {prompt}
          </div>

          <div className="flex justify-center">
            <button
              onClick={prompt === PROMPT.WARNING ? handleWarningClick : handleOKClick}
              className="rounded bg-green-light px-4 py-2"
            >
              Yes
            </button>
            <button onClick={handleCancelClick} className="rounded bg-red-700 px-4 py-2">
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
