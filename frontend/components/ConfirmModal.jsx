function ConfirmModal({ item, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-2xl w-80 shadow-xl text-center">
        <h3 className="text-lg font-semibold mb-4">Delete Confirmation</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this {item.type}?
        </p>
        <div className="flex justify-center gap-3">
          <button onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
          <button onClick={() => onConfirm(item, item.type)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
