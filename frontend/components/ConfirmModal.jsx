function ConfirmModal({ item, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="p-6 rounded-2xl w-80 shadow-xl text-center" style={{backgroundColor: 'rgba(8, 17, 27, 0.95)', border: '1px solid rgba(129, 54, 125, 0.3)'}}>
        <h3 className="text-lg font-semibold mb-4" style={{color: '#D8E4F3'}}>Delete Confirmation</h3>
        <p style={{color: '#D8E4F3'}}>
          Are you sure you want to delete this {item.type}?
        </p>
        <div className="flex justify-center gap-3 mt-4">
          <button onClick={onClose}
            className="px-4 py-2 rounded hover:opacity-80" style={{backgroundColor: 'rgba(129, 54, 125, 0.2)', color: '#D8E4F3'}}>Cancel</button>
          <button onClick={() => onConfirm(item, item.type)}
            className="text-white px-4 py-2 rounded hover:opacity-90"
            style={{backgroundColor: '#81367D'}}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
