import React, { useState } from 'react';
import '../styles/makePost.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const EditAbout = ({ about, closeModal }) => {
//   const [updateAbout, setUpdateAbout] = useState(about ? about.about : '');
  const [updateAbout, setUpdateAbout] = useState('');
  const username = localStorage.getItem('username')
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const aboutData = {
      updateAbout
    };

    try {
      // update user's about section in backend - eren
      await axios.post('http://localhost:8000/', aboutData);
      console.log('About section updated:', aboutData);
      closeModal();
      navigate(0); 
    } catch (error) {
      console.error('Error updating about section:', error);
    }
  };

  return (
    <div className="modal-background">
      <div className="modal-content">
        <h2>About Me</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="details">You can add a brief introduction about yourself, including any extracurricular activities, such as clubs or organizations you're involved in!</label>
            <textarea
              id="details"
              value={updateAbout}
              onChange={(e) => setUpdateAbout(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-actions">
            <button type="button" onClick={closeModal}>Cancel</button>
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAbout;
