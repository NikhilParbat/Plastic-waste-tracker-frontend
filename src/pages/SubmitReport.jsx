import { useState } from 'react';
import axios from 'axios';

const SubmitReport = () => {
  const [form, setForm] = useState({ location: '', type: '', description: '', image: null });

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in form) data.append(key, form[key]);

    await axios.post('/api/report', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert('Report submitted!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="location" placeholder="Location" onChange={handleChange} required />
      <select name="type" onChange={handleChange}>
        <option value="">Select Type</option>
        <option value="Plastic Bottle">Plastic Bottle</option>
        <option value="Plastic Bag">Plastic Bag</option>
      </select>
      <textarea name="description" placeholder="Short Description" onChange={handleChange} required />
      <input type="file" name="image" accept="image/*" onChange={handleChange} required />
      <button type="submit">Submit Report</button>
    </form>
  );
};

export default SubmitReport;
