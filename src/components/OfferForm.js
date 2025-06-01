import React, { useState } from 'react';
import '../styles/OfferForm.css';
import offerFormImage from '../assets/offer-form-image.png'; // swap in your actual asset

export default function OfferForm() {
  const [files, setFiles] = useState([]);

  function handleFileChange(e) {
    setFiles(Array.from(e.target.files));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: hook up to your backend
    alert('Form submitted!');
  }

  return (
    <section id="get-started" className="offer-form-section">
      <div className="form-left">
        <img 
          src={offerFormImage} 
          alt="Submit equipment details" 
        />
      </div>

      <form className="form-right modern-form" onSubmit={handleSubmit}>
        <h2>Tell Us About Your Equipment</h2>

        <div className="form-row">
          <div className="form-group">
            <input id="firstName" name="firstName" placeholder=" " required />
            <label htmlFor="firstName">First Name</label>
          </div>
          <div className="form-group">
            <input id="lastName" name="lastName" placeholder=" " required />
            <label htmlFor="lastName">Last Name</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input id="email" name="email" type="email" placeholder=" " required />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input id="phone" name="phone" type="tel" placeholder=" " required />
            <label htmlFor="phone">Phone</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input id="company" name="company" placeholder=" " required  />
            <label htmlFor="company">Company Name</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <select id="equipmentType" name="equipmentType" required>
            <option value="" disabled selected hidden></option>
              <option value="transformers">Transformers</option>
              <option value="pvf">Pipes, Valves &amp; Fittings</option>
              <option value="electrical">Electrical Equipment</option>
              <option value="other">Other Equipment</option>
            </select>
            <label htmlFor="equipmentType">Type of Equipment</label>
          </div>

          <div className="form-group">
            <select id="condition" name="condition" required>
            <option value="" disabled selected hidden></option>
              <option value="new">New</option>
              <option value="used_good">Used – Good</option>
              <option value="used_fair">Used – Fair</option>
              <option value="needs_repair">Needs Repair</option>
            </select>
            <label htmlFor="condition">Equipment Condition</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <textarea
                id="description"
                name="description"
                rows="4"
                placeholder=" "
                required
              />
            <label htmlFor="description">Description of Equipment</label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input id="city" name="city" placeholder=" " required />
            <label htmlFor="city">City</label>
          </div>
          <div className="form-group">
            <input id="state" name="state" placeholder=" " required />
            <label htmlFor="state">State</label>
          </div>
        </div>

        <div className="form-row photos">
          <div className="form-group">
            {/* hidden native input */}
            <input
              id="photos"
              name="photos"
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />

            {/* floating label – behaves like the other labels */}
            <label htmlFor="photos">Upload Photos of Equipment</label>

            {/* dashed drop–zone / trigger */}
            <button
              type="button"
              className="file-btn"
              onClick={() => document.getElementById('photos').click()}
            >
              {files.length === 0
                ? 'Click or drop images here'
                : `${files.length} file${files.length > 1 ? 's' : ''} selected`}
            </button>
          </div>
        </div>

        <button type="submit" className="btn-submit">
          Submit & Get Your Offer
        </button>
      </form>
    </section>
  );
}
