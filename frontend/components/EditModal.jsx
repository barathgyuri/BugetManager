import { useState } from "react";

function EditModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form, item.type);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-800 p-6 rounded-2xl w-96 shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-100">Edit {item.type}</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input type="date" name="date" value={form.date.split("T")[0]} onChange={handleChange}
            className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100" />
          <input type="number" name="amount" value={form.amount} onChange={handleChange}
            className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100" />
          <input type="text" name="category" value={form.category} onChange={handleChange}
            className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100" />
          <textarea name="description" value={form.description} onChange={handleChange}
            className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100" />
          {item.type === "expense" && (
            <select name="importance" value={form.importance} onChange={handleChange}
              className="border border-gray-600 rounded p-2 w-full bg-gray-700 text-gray-100">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose}
              className="bg-gray-600 text-gray-100 hover:bg-gray-500 px-4 py-2 rounded">Cancel</button>
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
