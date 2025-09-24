import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const branches = ["IT", "CSE", "ECE"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

function ManageAttendance({ setCurrentPage }) {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});

  const [newStudent, setNewStudent] = useState({
    enrollment: '',
    name: '',
    branch: '',
    year: '',
    semester: '',
  });

  useEffect(() => {
    const attendanceCollectionRef = collection(db, 'attendance_records');

    const unsubscribe = onSnapshot(attendanceCollectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAttendanceData(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching attendance data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getAttendancePercentage = (attended, total) => {
    return total > 0 ? Math.round((attended / total) * 100) : 0;
  };

  const getAttendanceStatus = (percentage) => {
    return percentage >= 75 ? 'status-pass' : 'status-fail';
  };

  const handleUpdateAttendance = async (studentId, subject, newAttendedValue) => {
    const studentRef = doc(db, 'attendance_records', studentId);
    try {
      const newAttended = parseInt(newAttendedValue);
      if (!isNaN(newAttended)) {
        await updateDoc(studentRef, {
          [`subjects.${subject}.attended`]: newAttended,
        });
        console.log("Attendance updated successfully!");
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setEditedData({ ...student.subjects });
  };

  const handleSave = async (studentId) => {
    const studentRef = doc(db, 'attendance_records', studentId);
    try {
      await updateDoc(studentRef, { subjects: editedData });
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

  const handleUpdateField = (subject, value) => {
    setEditedData(prev => ({
      ...prev,
      [subject]: { ...prev[subject], attended: value }
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.enrollment || !newStudent.name || !newStudent.branch) {
      alert('Please fill out all required fields.');
      return;
    }
    
    const initialSubjects = {};
    const baseTotalClasses = 50; 
    
    // Use the first student's subjects to create the initial structure for a new student
    const subjectKeys = attendanceData[0]?.subjects ? Object.keys(attendanceData[0].subjects) : ["Data Structures", "Algorithms", "Database", "OS"];

    subjectKeys.forEach(subject => {
      initialSubjects[subject] = { total: baseTotalClasses, attended: 0 };
    });
    
    const newRecord = {
      ...newStudent,
      subjects: initialSubjects,
    };

    try {
      await addDoc(collection(db, 'attendance_records'), newRecord);
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

  const filteredData = attendanceData.filter(student => {
    return (
      (selectedBranch === '' || student.branch === selectedBranch) &&
      (selectedYear === '' || student.year === selectedYear) &&
      (selectedSemester === '' || student.semester === selectedSemester)
    );
  });

  if (loading) {
    return <div className="loading">Loading attendance data...</div>;
  }

  return (
    <div className="attendance-page-container">
      <div className="attendance-page-header">
        <h1>Manage Student Attendance</h1>
        <button className="back-btn" onClick={() => setCurrentPage('AdminDashboard')}>Back</button>
      </div>

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

      <div className="attendance-table-container">
        <h2>Attendance Details</h2>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Enrollment No.</th>
              <th>Name</th>
              {filteredData.length > 0 && Object.keys(filteredData[0].subjects).map(subject => (
                <React.Fragment key={subject}>
                  <th colSpan="2">{subject}</th>
                </React.Fragment>
              ))}
            </tr>
            <tr>
              <th></th>
              <th></th>
              {filteredData.length > 0 && Object.keys(filteredData[0].subjects).map(subject => (
                <React.Fragment key={`${subject}-sub`}>
                  <th>Attended/Total</th>
                  <th>Status</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map(student => (
              <tr key={student.id}>
                <td>{student.enrollment}</td>
                <td>{student.name}</td>
                {Object.keys(student.subjects).map((subject, index) => {
                  const data = student.subjects[subject];
                  const percentage = getAttendancePercentage(data.attended, data.total);
                  const statusClass = getAttendanceStatus(percentage);
                  return (
                    <React.Fragment key={`${student.id}-${index}`}>
                       {editingId === student.id ? (
                        <>
                          <td>
                            <input
                              type="number"
                              value={editedData[subject]?.attended || ''}
                              onChange={(e) => {
                            // You need to update the local state to see the change
                            const updatedData = attendanceData.map(s => {
                              if (s.id === student.id) {
                                return {
                                  ...s,
                                  subjects: {
                                    ...s.subjects,
                                    [subject]: {
                                      ...s.subjects[subject],
                                      attended: parseInt(e.target.value)
                                    }
                                  }
                                };
                              }
                              return s;
                            });
                            setAttendanceData(updatedData);
                          }}
                          onBlur={(e) => handleUpdateAttendance(student.id, subject, e.target.value)}
                          className="attendance-input"
                              // onChange={(e) => handleUpdateField(subject, e.target.value)}
                              // className="attendance-input"
                              min="0"
                              max={data.total}
                            />
                            / {data.total} ({percentage}%)
                          </td>
                          <td className={statusClass}>{statusClass === 'status-pass' ? 'Above 75%' : 'Below 75%'}</td>
                        </>
                      ) : (
                        <>
                          <td>{data.attended} / {data.total} ({percentage}%)</td>
                          <td className={statusClass}>{statusClass === 'status-pass' ? 'Above 75%' : 'Below 75%'}</td>
                        </>
                      )}
                    </React.Fragment>
                  );
                })}
                <td>
                    {editingId === student.id ? (
                        <>
                            <button className="save-btn" onClick={() => handleSave(student.id)}>Save</button>
                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        </>
                    ) : (
                        <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageAttendance;