import React, { useState } from 'react';
import '../styles/editAbout.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const EditAbout = ({ about, closeModal }) => {
  const [updateAbout, setUpdateAbout] = useState(about ? about : '');
  const username = localStorage.getItem('username');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const aboutData = updateAbout; 
    
    try {
      await axios.put(`http://localhost:8000/auth/${username}/update-about/`, aboutData, {
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      console.log('About section updated:', aboutData);
      closeModal();
      navigate(0); 
    } catch (error) {
      console.error('Error updating about section:', error);
    }
  };

  return (
    <div className="editAbout-modal-background">
      <div className="editAbout-modal-content">
        <h2>About Me</h2>
        <form onSubmit={handleSubmit}>
          <div className="editAbout-form-group">
            <label htmlFor="details">You can add a brief introduction about yourself, including any extracurricular activities, such as clubs or organizations you're involved in!</label>
            <textarea
              id="details"
              className="editAbout-textarea" 
              value={updateAbout}
              onChange={(e) => setUpdateAbout(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="editAbout-form-actions">
            <button type="button" className="editAbout-button" onClick={closeModal}>Cancel</button>
            <button type="submit" className="editAbout-button">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAbout;
