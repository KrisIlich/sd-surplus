// src/components/DownloadChartModal.js
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "../styles/Guides.css";

/* ───────── props ─────────
   open      : Boolean  – show / hide
   onClose   : Function – called on × or after submit
   onSubmit  : Function – optional callback(formData)
   fileSrc   : String   – path to png / pdf / etc.
   fileName  : String   – name shown in browser download tray
   ───────────────────────── */
export default function DownloadChartModal({
  open,
  onClose,
  onSubmit,
  fileSrc  = "/assets/bolt-sizing-chart.pdf",
  fileName = "ASME_B16-5_bolt_chart.pdf",
}) {
  /* hooks must run every render */
  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    phone:     "",
    email:     "",
    company:   "",
    businessType: "",
  });

  /* freeze background scroll while modal is open */
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* bail out after hooks so ESLint is happy */
  if (!open) return null;

  /* helpers */
  const handleChange = ({ target:{ name, value } }) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);

    /* one-liner download (works for any file type) */
    const a = Object.assign(document.createElement("a"), {
      href: fileSrc,
      download: fileName,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    onClose();
  };

  /* modal markup */
  const modalJSX = (
    <div className="modal-backdrop open" onClick={onClose}>
      <div className="modal open" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>Get the full sizing chart</h2>
        <p className="modal-sub">
          Drop in your details &amp; we’ll start the download.
        </p>

        <form className="chart-form" onSubmit={handleSubmit}>
          <div className="field-duo">
            <input required name="firstName" placeholder="First name"
                   value={form.firstName} onChange={handleChange}/>
            <input required name="lastName"  placeholder="Last name"
                   value={form.lastName}  onChange={handleChange}/>
          </div>

          <input name="company"       placeholder="Company"
                 value={form.company} onChange={handleChange}/>
          <input name="businessType"  placeholder="Business type / industry"
                 value={form.businessType} onChange={handleChange}/>
          <input name="phone" type="tel"   placeholder="Phone"
                 value={form.phone} onChange={handleChange}/>
          <input required name="email" type="email" placeholder="Email address"
                 value={form.email} onChange={handleChange}/>

          <button type="submit" className="cta-btn large">Download now</button>
        </form>
      </div>
    </div>
  );

  /* render outside any transformed ancestor */
  return ReactDOM.createPortal(modalJSX, document.body);
}
