interface IDeleteModal {
  visible: boolean;
  onClose: VoidFunction;
  contentString: string;
  deleteOnClick: () => Promise<void>;
}

export default function Modal({ visible, onClose, contentString, deleteOnClick }: IDeleteModal) {
  if (!visible) {
    return null;
  } else {
    return (
      <div className="w-screen fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <div className="flex flex-col bg-white p-3 m-3 rounded-lg">
          <h1 className="font-semibold text-center text-xl">Confirm Deletion</h1>
          <hr className="border-t-2 mb-6 mt-3 border-black/[.50]" />

          <div className="flex flex-col">
            <p className="m-3 text-lg">{contentString}</p>
            <div className="text-center m-2">
              <button
                className="px-5 py-1 mx-3 bg-white border-black border-2 text-black hover:bg-red-600 hover:text-white rounded"
                onClick={deleteOnClick}
              >
                Delete
              </button>
              <button
                className="px-5 py-1 mx-3 bg-white border-black border-2 text-black hover:bg-red-600 hover:text-white rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
