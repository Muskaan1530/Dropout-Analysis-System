import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const branches = ["IT", "CSE", "ECE", "ME"]; // Added ME branch
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
    
    const calculateAmountLeft = (total, paid) => {
        return (parseInt(total, 10) || 0) - (parseInt(paid, 10) || 0);
    };

    const getStatusText = (total, paid) => {
        const left = calculateAmountLeft(total, paid);
        if (left <= 0) return 'Paid';
        if (paid > 0) return 'Partial';
        return 'Unpaid';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid':
                return '#2ECC71'; // Green
            case 'Partial':
                return '#F39C12'; // Orange/Yellow
            case 'Unpaid':
            default:
                return '#E74C3C'; // Red
        }
    };
    
    const handleEdit = (student) => {
        setEditingId(student.id);
        // Copy all student data for editing
        setEditedData(student);
    };
    
    const handleSave = async () => {
        const studentRef = doc(db, 'fee_records', editingId);
        
        // Prepare data for saving
        try {
            // Ensure numeric fields are parsed correctly
            const newAmountPaid = parseInt(editedData.amountPaid, 10) || 0;
            const newTotalAmount = parseInt(editedData.totalAmount, 10) || 0;
            
            // Calculate new status text dynamically
            const newStatus = getStatusText(newTotalAmount, newAmountPaid);
            
            // Create the final object to update, ensuring all fields are included
            const dataToUpdate = {
                enrollment: editedData.enrollment,
                name: editedData.name,
                email: editedData.email,
                branch: editedData.branch,
                year: editedData.year,
                semester: editedData.semester,
                totalAmount: newTotalAmount,
                amountPaid: newAmountPaid,
                status: newStatus
            };

            await updateDoc(studentRef, dataToUpdate);
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
        
        // Ensure all necessary fields are filled (added year and semester to requirement)
        if (!newFeeRecord.enrollment || !newFeeRecord.name || !newFeeRecord.branch || !newFeeRecord.year || !newFeeRecord.semester || !newFeeRecord.totalAmount) {
            alert('Please fill out all required fields.');
            return;
        }

        const total = parseInt(newFeeRecord.totalAmount);
        const paid = parseInt(newFeeRecord.amountPaid);
        const status = getStatusText(total, paid);
        
        try {
            const newRecord = {
                ...newFeeRecord,
                totalAmount: total,
                amountPaid: paid,
                status: status,
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
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Semester</th>
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
                                <td colSpan="11">No fee records found for the selected filters.</td>
                            </tr>
                        ) : (
                            filteredFeeData.map(student => (
                                <tr key={student.id}>
                                    {editingId === student.id ? (
                                        <>
                                            {/* Editable Student Details */}
                                            <td><input type="text" value={editedData.enrollment} onChange={(e) => handleUpdateField('enrollment', e.target.value)} /></td>
                                            <td><input type="text" value={editedData.name} onChange={(e) => handleUpdateField('name', e.target.value)} /></td>
                                            <td><input type="email" value={editedData.email} onChange={(e) => handleUpdateField('email', e.target.value)} /></td>
                                            <td>
                                                <select value={editedData.branch} onChange={(e) => handleUpdateField('branch', e.target.value)}>
                                                    {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <select value={editedData.year} onChange={(e) => handleUpdateField('year', e.target.value)}>
                                                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                                                </select>
                                            </td>
                                            <td>
                                                <select value={editedData.semester} onChange={(e) => handleUpdateField('semester', e.target.value)}>
                                                    {semesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}
                                                </select>
                                            </td>
                                            
                                            {/* Editable Fee Details */}
                                            <td><input type="number" value={editedData.totalAmount} onChange={(e) => handleUpdateField('totalAmount', e.target.value)} /></td>
                                            <td><input type="number" value={editedData.amountPaid} onChange={(e) => handleUpdateField('amountPaid', e.target.value)} /></td>
                                            
                                            {/* Live Calculated Fields */}
                                            <td>₹{calculateAmountLeft(editedData.totalAmount, editedData.amountPaid).toLocaleString()}</td>
                                            <td style={{ color: getStatusColor(getStatusText(editedData.totalAmount, editedData.amountPaid)), fontWeight: 'bold' }}>
                                                {getStatusText(editedData.totalAmount, editedData.amountPaid)}
                                            </td>

                                            {/* Actions */}
                                            <td>
                                                <button className="save-btn" onClick={handleSave}>Save</button>
                                                <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                            </td>
                                        </>
                                    ) : (
                                        /* Display Mode */
                                        <>
                                            <td>{student.enrollment}</td>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.branch}</td>
                                            <td>{student.year}</td>
                                            <td>{student.semester}</td>
                                            <td>₹{student.totalAmount?.toLocaleString() || '0'}</td>
                                            <td>₹{student.amountPaid?.toLocaleString() || '0'}</td>
                                            <td>₹{calculateAmountLeft(student.totalAmount, student.amountPaid).toLocaleString()}</td>
                                            <td style={{ color: getStatusColor(getStatusText(student.totalAmount, student.amountPaid)), fontWeight: 'bold' }}>
                                                {getStatusText(student.totalAmount, student.amountPaid)}
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