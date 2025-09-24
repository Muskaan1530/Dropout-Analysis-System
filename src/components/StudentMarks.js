import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const branches = ["IT", "CSE", "ECE", "ME"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

function StudentMarks({ setCurrentPage }) {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [studentMarksData, setStudentMarksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Track the ID of the student being edited
  const [editedData, setEditedData] = useState({}); // Store the data of the student being edited

  // State for new student form inputs
  const [newStudent, setNewStudent] = useState({
    enrollment: '',
    name: '',
    branch: '',
    year: '',
    semester: '',
  });

  useEffect(() => {
    const studentMarksCollectionRef = collection(db, 'student_marks');

    const unsubscribe = onSnapshot(studentMarksCollectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudentMarksData(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching student marks data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateMarks = async (studentId, subject, newMarks) => {
    const studentRef = doc(db, 'student_marks', studentId);
    try {
      const newMark = parseInt(newMarks);
      if (!isNaN(newMark) && newMark >= 0 && newMark <= 100) {
        await updateDoc(studentRef, {
          [`subjects.${subject}`]: newMark,
        });
        console.log("Marks updated successfully!");
      }
    } catch (error) {
      console.error("Error updating marks:", error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.enrollment || !newStudent.name || !newStudent.branch) {
      alert('Please fill out all required fields.');
      return;
    }

    const initialSubjects = {};
    Object.keys(studentMarksData[0]?.subjects || {"Data Structures":0, "Algorithms":0, "Database":0, "OS":0}).forEach(subject => {
      initialSubjects[subject] = 0;
    });

    const newRecord = {
      ...newStudent,
      subjects: initialSubjects,
    };

    try {
      await addDoc(collection(db, 'student_marks'), newRecord);
      alert('New student record added successfully!');
      setNewStudent({
        enrollment: '',
        name: '',
        branch: '',
        year: '',
        semester: '',
      });
    } catch (error) {
      console.error('Error adding new student:', error);
      alert('Error adding new student. Check console for details.');
    }
  };

  const filteredData = studentMarksData.filter(student => {
    return (
      (selectedBranch === '' || student.branch === selectedBranch) &&
      (selectedYear === '' || student.year === selectedYear) &&
      (selectedSemester === '' || student.semester === selectedSemester)
    );
  });
  
  const handleEdit = (student) => {
      setEditingId(student.id);
      setEditedData(student);
  };
  
  const handleSave = async () => {
    const studentRef = doc(db, 'student_marks', editingId);
    try {
        await updateDoc(studentRef, {
            enrollment: editedData.enrollment,
            name: editedData.name,
            subjects: editedData.subjects,
        });
        console.log("Record updated successfully!");
        setEditingId(null);
        setEditedData({});
    } catch (error) {
        console.error("Error updating record:", error);
    }
  };
  
  const handleCancel = () => {
      setEditingId(null);
      setEditedData({});
  };
  
  const handleUpdateField = (field, value) => {
      setEditedData(prev => ({
          ...prev,
          [field]: value
      }));
  };
  
  const handleUpdateSubjectMarks = (subject, value) => {
      setEditedData(prev => ({
          ...prev,
          subjects: {
              ...prev.subjects,
              [subject]: parseInt(value)
          }
      }));
  };

  if (loading) {
    return <div className="loading">Loading student marks data...</div>;
  }

  return (
    <div className="marks-page-container">
      <div className="marks-page-header">
        <h1>Student Marks Details</h1>
        <button className="back-btn" onClick={() => setCurrentPage('AdminDashboard')}>Back</button>
      </div>

  {/* return (
    <div className="marks-page-container">
      <div className="marks-page-header">
        <div className='marks-page-header-content'>
          <h1>Student Marks Details</h1>
          <button className="back-btn" onClick={() => setCurrentPage('AdminDashboard')}>Back</button>
        </div>
      </div> */}

      <div className="filter-section">
        <select onChange={(e) => setSelectedBranch(e.target.value)} value={selectedBranch}>
          <option value="">Select Branch</option>
          {branches.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
          <option value="">Select Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <select onChange={(e) => setSelectedSemester(e.target.value)} value={selectedSemester}>
          <option value="">Select Semester</option>
          {semesters.map(semester => (
            <option key={semester} value={semester}>{semester}</option>
          ))}
        </select>
      </div>

      <div className="add-student-form-container">
        <h2>Add New Student</h2>
        <form onSubmit={handleAddStudent} className="add-student-form">
          <input
            type="text"
            placeholder="Enrollment No."
            value={newStudent.enrollment}
            onChange={(e) => setNewStudent({ ...newStudent, enrollment: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Student Name"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            required
          />
          <select value={newStudent.branch} onChange={(e) => setNewStudent({ ...newStudent, branch: e.target.value })} required>
            <option value="">Select Branch</option>
            {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
          </select>
          <select value={newStudent.year} onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })} required>
            <option value="">Select Year</option>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
          <select value={newStudent.semester} onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })} required>
            <option value="">Select Semester</option>
            {semesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}
          </select>
          <button type="submit" className="add-btn">Add Student</button>
        </form>
      </div>

      <div className="marks-table-container">
        <h2>Student Marks</h2>
        <table className="marks-table">
          <thead>
            <tr>
              <th>Enrollment No.</th>
              <th>Name</th>
              {filteredData.length > 0 && Object.keys(filteredData[0].subjects).map(subject => (
                <th key={subject}>{subject}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(student => (
              <tr key={student.id}>
                {editingId === student.id ? (
                  <>
                    <td><input type="text" value={editedData.enrollment} onChange={(e) => handleUpdateField('enrollment', e.target.value)} /></td>
                    <td><input type="text" value={editedData.name} onChange={(e) => handleUpdateField('name', e.target.value)} /></td>
                    {Object.keys(editedData.subjects).map((subject, index) => (
                      <td key={index}>
                        <input
                          type="number"
                          value={editedData.subjects[subject]}
                          onChange={(e) => handleUpdateSubjectMarks(subject, e.target.value)}
                          className="marks-input"
                          min="0"
                          max="100"
                        />
                      </td>
                    ))}
                    <td>
                      <button className="save-btn" onClick={handleSave}>Save</button>
                      <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{student.enrollment}</td>
                    <td>{student.name}</td>
                    {Object.keys(student.subjects).map((subject, index) => (
                      <td key={index} className={student.subjects[subject] < 40 ? 'marks-fail' : 'marks-pass'}>{student.subjects[subject]}</td>
                    ))}
                    <td>
                      <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentMarks;