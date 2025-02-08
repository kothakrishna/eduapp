import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Insert.css';

const Insert = () => {
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '', location: '' });
  const [csvFile, setCsvFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [viewData, setViewData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    handleView(page);
    fetchTotalCount();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(`http://localhost:5000/check_email?email=${email}`);
      setEmailExists(response.data.exists);
      if (response.data.exists) {
        setError('Email already exists');
      } else {
        setError(null);
      }
    } catch (error) {
      setError('Error checking email');
    }
  };

  const handleEmailBlur = (e) => {
    const email = e.target.value;
    checkEmailExists(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailExists) {
      alert('Email already exists');
      return;
    }
    try {
      await axios.post('http://localhost:5000/insert', formData);
      alert('Data inserted successfully!');
      setError(null);
      fetchTotalCount();
      handleView(page);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error inserting data';
      alert(errorMessage);
      setError(errorMessage);
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
      fetchTotalCount();
      handleView(page);
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
      alert('Image uploaded successfully!');
      setResponse(res.data.response); // Access the response text
      setError(null);
      fetchTotalCount();
      handleView(page);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
      setResponse(null);
    }
  };

  const handleView = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/view?page=${page}&limit=10`);
      setViewData(response.data);
      setHasMore(response.data.length === 10);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data');
    }
  };
  
  const fetchTotalCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/count');
      setTotalCount(response.data.count);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error fetching total count';
      alert(errorMessage);
      setError(errorMessage);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await axios.get('http://localhost:5000/download', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'info.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading data:', error);
      alert('Error downloading data');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      alert('Record deleted successfully!');
      handleView(page); // Refresh the view after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Error deleting data');
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };


  return (
    <div className="container">
      <h1>Data Entry</h1>
      <p>Total Records: {totalCount}</p>
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
          onBlur={handleEmailBlur}
          required
        />
        {emailExists && <div className="error">Email already exists</div>}
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

      <button onClick={handleView}>View</button>
      <button onClick={handleDownload}>Download as Excel</button>
      {viewData.length > 0 && (
        <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {viewData.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.mobile}</td>
                <td>{item.location}</td>
                <td>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
            <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
            <button onClick={handleNextPage} disabled={!hasMore}>Next</button>
          </div>
        </div> 
      )}
    </div>
  );
};

export default Insert;
