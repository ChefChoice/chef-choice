interface IModal {
  visible: boolean;
  title: string;
  content: React.ReactNode;
  leftBtnText?: string;
  rightBtnText: string;
  leftBtnOnClick?: () => Promise<void>;
  rightBtnOnClick: VoidFunction;
  hideLeftBtn: boolean;
}

export default function Modal({
  visible,
  title,
  content,
  leftBtnText,
  rightBtnText,
  leftBtnOnClick,
  rightBtnOnClick,
  hideLeftBtn,
}: IModal) {
  if (!visible) {
    return null;
  } else {
    return (
      <div className="relative z-50">
        <div className="fixed inset-0 bg-black/20" />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <div className="m-3 rounded-lg border-2 border-solid bg-white p-3 sm:w-1/4">
            <h1 className="text-center text-xl font-semibold">{title}</h1>
            <hr className="mb-6 mt-3 border-t-2 border-black/[.50]" />

            <div className="flex flex-col place-items-center">
              {content}

              <div className="mt-5 text-center">
                {!hideLeftBtn && (
                  <button
                    className="mx-3 rounded bg-red-700 px-5 py-1 text-white hover:bg-red-500 hover:ring hover:ring-red-400"
                    onClick={leftBtnOnClick}
                  >
                    {leftBtnText}
                  </button>
                )}

                <button
                  className="mx-3 rounded bg-green-light px-5 py-1 text-white hover:bg-green-hover hover:ring hover:ring-green-500"
                  onClick={rightBtnOnClick}
                >
                  {rightBtnText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
