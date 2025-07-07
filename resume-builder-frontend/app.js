import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

function App() {
  const [signedIn, setSignedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact: '',
    yearsOfExperience: '',
    education: '',
    experience: [{ company: '', position: '', duration: '', description: '' }],
    skills: '',
    targetRole: '',
    summary: '',
  });
  const [template, setTemplate] = useState('simple');
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSignIn = () => setSignedIn(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const newExperience = [...userData.experience];
    newExperience[index][name] = value;
    setUserData({ ...userData, experience: newExperience });
  };

  const addExperience = () => {
    setUserData({ ...userData, experience: [...userData.experience, { company: '', position: '', duration: '', description: '' }] });
  };

  const removeExperience = (index) => {
    const newExperience = userData.experience.filter((_, i) => i !== index);
    setUserData({ ...userData, experience: newExperience });
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-summary', {
        name: userData.name,
        targetRole: userData.targetRole,
        yearsOfExperience: userData.yearsOfExperience,
        skills: userData.skills,
        experience: userData.experience,
      });
      setUserData({ ...userData, summary: response.data.summary });
    } catch (error) {
      alert('Error generating summary');
    }
    setLoadingSummary(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(userData.name, 10, 10);
    doc.setFontSize(12);
    doc.text(`Email: ${userData.email}`, 10, 20);
    doc.text(`Contact: ${userData.contact}`, 10, 30);
    doc.text(`Years of Experience: ${userData.yearsOfExperience}`, 10, 40);
    doc.text(`Target Role: ${userData.targetRole}`, 10, 50);
    doc.text('Summary:', 10, 60);
    doc.text(userData.summary, 10, 70);
    doc.text('Experience:', 10, 90);
    let y = 100;
    userData.experience.forEach((exp, i) => {
      doc.text(`${i + 1}. ${exp.position} at ${exp.company} (${exp.duration})`, 10, y);
      y += 10;
      doc.text(exp.description, 15, y);
      y += 10;
    });
    doc.text('Education:', 10, y + 10);
    doc.text(userData.education, 10, y + 20);
    doc.text('Skills:', 10, y + 30);
    doc.text(userData.skills, 10, y + 40);
    doc.save('resume.pdf');
  };

  if (!signedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Sign In</h2>
        <button onClick={handleSignIn}>Sign In (Mock)</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Resume Builder</h2>

      <div>
        <label>Choose Template: </label>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="simple">Simple</option>
          <option value="modern">Modern</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Name: </label>
        <input name="name" value={userData.name} onChange={handleChange} />
      </div>

      <div>
        <label>Email: </label>
        <input name="email" value={userData.email} onChange={handleChange} />
      </div>

      <div>
        <label>Contact: </label>
        <input name="contact" value={userData.contact} onChange={handleChange} />
      </div>

      <div>
        <label>Years of Experience: </label>
        <input name="yearsOfExperience" value={userData.yearsOfExperience} onChange={handleChange} />
      </div>

      <div>
        <label>Target Role: </label>
        <input name="targetRole" value={userData.targetRole} onChange={handleChange} />
      </div>

      <div>
        <label>Education: </label>
        <textarea name="education" value={userData.education} onChange={handleChange} />
      </div>

      <div>
        <label>Skills: </label>
        <textarea name="skills" value={userData.skills} onChange={handleChange} />
      </div>

      <div>
        <h3>Experience</h3>
        {userData.experience.map((exp, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <div>
              <label>Company: </label>
              <input name="company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} />
            </div>
            <div>
              <label>Position: </label>
              <input name="position" value={exp.position} onChange={(e) => handleExperienceChange(index, e)} />
            </div>
            <div>
              <label>Duration: </label>
              <input name="duration" value={exp.duration} onChange={(e) => handleExperienceChange(index, e)} />
            </div>
            <div>
              <label>Description: </label>
              <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} />
            </div>
            <button onClick={() => removeExperience(index)}>Remove Experience</button>
          </div>
        ))}
        <button onClick={addExperience}>Add Experience</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={generateSummary} disabled={loadingSummary}>
          {loadingSummary ? 'Generating Summary...' : 'Generate Summary'}
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3>Summary</h3>
        <textarea value={userData.summary} onChange={(e) => setUserData({ ...userData, summary: e.target.value })} rows={4} cols={50} />
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={downloadPDF}>Download PDF</button>
      </div>
    </div>
  );
}

export default App;
