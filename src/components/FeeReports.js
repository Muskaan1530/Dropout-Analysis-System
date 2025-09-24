import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const branches = ["IT", "CSE", "ECE", "ME"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

function FeeReports({ setCurrentPage }) {
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [feeData, setFeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // Track the ID of the student being edited
  const [editedData, setEditedData] = useState({}); // Store the data of the student being edited

  // State for new student fee record form
  const [newFeeRecord, setNewFeeRecord] = useState({
    enrollment: '',
    name: '',
    email: '',
    branch: '',
    year: '',
    semester: '',
    totalAmount: 75000, // Default amount
    amountPaid: 0,
    status: 'Unpaid',
  });

  useEffect(() => {
    const feeCollectionRef = collection(db, 'fee_records');

    const unsubscribe = onSnapshot(feeCollectionRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeeData(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching fee data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleEdit = (student) => {
      setEditingId(student.id);
      setEditedData(student);
  };
  
  const handleSave = async () => {
    const studentRef = doc(db, 'fee_records', editingId);
    try {
        const newAmountPaid = parseInt(editedData.amountPaid, 10);
        const newTotalAmount = parseInt(editedData.totalAmount, 10);
        const newStatus = newAmountPaid >= newTotalAmount ? 'Paid' : 'Unpaid';
        
        await updateDoc(studentRef, {
            ...editedData,
            amountPaid: newAmountPaid,
            totalAmount: newTotalAmount,
            status: newStatus
        });
        console.log("Fee record updated successfully!");
        setEditingId(null);
        setEditedData({});
    } catch (error) {
        console.error("Error updating fee record:", error);
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

  const handleAddFeeRecord = async (e) => {
    e.preventDefault();
    if (!newFeeRecord.enrollment || !newFeeRecord.name || !newFeeRecord.branch || !newFeeRecord.totalAmount) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const newRecord = {
        ...newFeeRecord,
        totalAmount: parseInt(newFeeRecord.totalAmount),
        amountPaid: parseInt(newFeeRecord.amountPaid),
        status: parseInt(newFeeRecord.amountPaid) >= parseInt(newFeeRecord.totalAmount) ? 'Paid' : 'Unpaid',
      };
      await addDoc(collection(db, 'fee_records'), newRecord);
      alert('New fee record added successfully!');
      setNewFeeRecord({
        enrollment: '',
        name: '',
        email: '',
        branch: '',
        year: '',
        semester: '',
        totalAmount: 75000,
        amountPaid: 0,
        status: 'Unpaid',
      });
    } catch (error) {
      console.error('Error adding new fee record:', error);
      alert('Error adding new fee record. Check console for details.');
    }
  };

  const filteredFeeData = feeData.filter(student => {
    return (
      (selectedBranch === '' || student.branch === selectedBranch) &&
      (selectedYear === '' || student.year === selectedYear) &&
      (selectedSemester === '' || student.semester === selectedSemester)
    );
  });

  if (loading) {
    return <div className="loading">Loading fee data...</div>;
  }

  return (
    <div className="fee-page-container">
      <div className="fee-page-header">
        <h1>Fee Collection & Reports</h1>
        <button className="back-btn" onClick={() => setCurrentPage('AdminDashboard')}>Back</button>
      </div>

  {/* return (
    <div className="fee-page-container">
      <div className="fee-page-header">
        <div className='fee-page-header-content'>
          <h1>Fee Collection & Reports</h1>
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
      
      <div className="add-fee-record-form-container">
        <h2>Add New Fee Record</h2>
        <form onSubmit={handleAddFeeRecord} className="add-fee-record-form">
          <input type="text" placeholder="Enrollment No." value={newFeeRecord.enrollment} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, enrollment: e.target.value })} required />
          <input type="text" placeholder="Student Name" value={newFeeRecord.name} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, name: e.target.value })} required />
          <input type="email" placeholder="Email" value={newFeeRecord.email} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, email: e.target.value })} required />
          <input type="number" placeholder="Total Amount" value={newFeeRecord.totalAmount} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, totalAmount: e.target.value })} required />
          <input type="number" placeholder="Amount Paid" value={newFeeRecord.amountPaid} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, amountPaid: e.target.value })} required />
          <select value={newFeeRecord.branch} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, branch: e.target.value })} required>
            <option value="">Select Branch</option>
            {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
          </select>
          <select value={newFeeRecord.year} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, year: e.target.value })} required>
            <option value="">Select Year</option>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
          <select value={newFeeRecord.semester} onChange={(e) => setNewFeeRecord({ ...newFeeRecord, semester: e.target.value })} required>
            <option value="">Select Semester</option>
            {semesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}
          </select>
          <button type="submit" className="add-btn">Add Record</button>
        </form>
      </div>

      <div className="fee-records-table-container">
        <h2>Fee Records</h2>
        <table className="fee-records-table">
          <thead>
            <tr>
              <th>Enrollment No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Total Amount</th>
              <th>Amount Paid</th>
              <th>Amount Left</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeeData.length === 0 ? (
              <tr>
                <td colSpan="8">No fee records found for the selected filters.</td>
              </tr>
            ) : (
              filteredFeeData.map(student => (
                <tr key={student.id}>
                  {editingId === student.id ? (
                      <>
                          <td><input type="text" value={editedData.enrollment} onChange={(e) => handleUpdateField('enrollment', e.target.value)} /></td>
                          <td><input type="text" value={editedData.name} onChange={(e) => handleUpdateField('name', e.target.value)} /></td>
                          <td><input type="email" value={editedData.email} onChange={(e) => handleUpdateField('email', e.target.value)} /></td>
                          <td><input type="number" value={editedData.totalAmount} onChange={(e) => handleUpdateField('totalAmount', e.target.value)} /></td>
                          <td><input type="number" value={editedData.amountPaid} onChange={(e) => handleUpdateField('amountPaid', e.target.value)} /></td>
                          <td>₹{(editedData.totalAmount - editedData.amountPaid)?.toLocaleString() || '0'}</td>
                          <td style={{ color: editedData.status === 'Paid' ? '#2ECC71' : '#E74C3C', fontWeight: 'bold' }}>
                            {editedData.status}
                          </td>
                          <td>
                              <button className="save-btn" onClick={handleSave}>Save</button>
                              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                          </td>
                      </>
                  ) : (
                      <>
                          <td>{student.enrollment}</td>
                          <td>{student.name}</td>
                          <td>{student.email}</td>
                          <td>₹{student.totalAmount?.toLocaleString() || '0'}</td>
                          <td>₹{student.amountPaid?.toLocaleString() || '0'}</td>
                          <td>₹{(student.totalAmount - student.amountPaid)?.toLocaleString() || '0'}</td>
                          <td style={{ color: student.status === 'Paid' ? '#2ECC71' : '#E74C3C', fontWeight: 'bold' }}>
                            {student.status}
                          </td>
                          <td>
                              <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                          </td>
                      </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeeReports;