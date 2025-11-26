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
      <div className="p-6 rounded-2xl w-96 shadow-xl" style={{backgroundColor: 'rgba(8, 17, 27, 0.95)', border: '1px solid rgba(129, 54, 125, 0.3)'}}>
        <h3 className="text-xl font-semibold mb-4" style={{color: '#D8E4F3'}}>Edit {item.type}</h3>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input type="date" name="date" value={form.date.split("T")[0]} onChange={handleChange}
            className="border rounded p-2 w-full" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} />
          <input type="number" name="amount" value={form.amount} onChange={handleChange}
            className="border rounded p-2 w-full" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} />
          <input type="text" name="category" value={form.category} onChange={handleChange}
            className="border rounded p-2 w-full" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} />
          <textarea name="description" value={form.description} onChange={handleChange}
            className="border rounded p-2 w-full" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}} />
          {item.type === "expense" && (
            <select name="importance" value={form.importance} onChange={handleChange}
              className="border rounded p-2 w-full" style={{borderColor: '#81367D', backgroundColor: 'rgba(129, 54, 125, 0.1)', color: '#D8E4F3'}}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <button type="button" onClick={onClose}
              className="px-4 py-2 rounded hover:opacity-80" style={{backgroundColor: 'rgba(129, 54, 125, 0.2)', color: '#D8E4F3'}}>Cancel</button>
            <button type="submit"
              className="text-white px-4 py-2 rounded hover:opacity-90" style={{backgroundColor: '#3469A9'}}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
