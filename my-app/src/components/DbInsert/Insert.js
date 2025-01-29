import React, { useState } from 'react';
import axios from 'axios';
import './Insert.css';

const Insert = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', location: '' });
  const [csvFile, setCsvFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/insert', formData);
      alert('Data inserted successfully!');
    } catch (error) {
      alert('Error inserting data');
    }
  };

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('CSV data uploaded successfully!');
    } catch (error) {
      alert('Error uploading CSV file');
    }
  };

  const handleImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle form submission
  const handleImageSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:5000/uploadimage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResponse(res.data.response); // Access the response text
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
      setResponse(null);
    }
  };


  return (
    <div className="container">
      <h1>Data Entry</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile No"
          value={formData.mobile}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Upload CSV</h2>
      <form onSubmit={handleFileSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} required />
        <button type="submit">Submit File</button>
      </form>
      <h2>Upload Image</h2>
      <form onSubmit={handleImageSubmit}>
        <input type="file" accept=".png" onChange={handleImageChange} required />
        <button type="submit">Submit image</button>
      </form>
    </div>
  );
};

export default Insert;
