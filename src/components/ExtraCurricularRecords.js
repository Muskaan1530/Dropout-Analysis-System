import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const branches = ["IT", "CSE", "ECE", "ME"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

function ExtraCurricularRecords({ setCurrentPage }) {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [achievementsData, setAchievementsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});

    // State for new achievement record form
    const [newAchievement, setNewAchievement] = useState({
        enrollment: '',
        name: '',
        branch: '',
        year: '',
        semester: '',
        achievement: '',
        ach_year: '',
        proof_url: '',
    });

    useEffect(() => {
        const recordsCollectionRef = collection(db, 'extracurricular_records');

        // onSnapshot for real-time updates
        const unsubscribe = onSnapshot(recordsCollectionRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAchievementsData(data);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching achievements data:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);
    
    const handleEdit = (student) => {
        setEditingId(student.id);
        setEditedData(student);
    };

    const handleSave = async () => {
        const studentRef = doc(db, 'extracurricular_records', editingId);
        try {
            // Prepare data, ensuring ach_year is stored as a number (or string if it's empty)
            const dataToUpdate = {
                ...editedData,
                ach_year: editedData.ach_year ? parseInt(editedData.ach_year, 10) : editedData.ach_year,
            };
            
            // Remove the temporary 'id' property if it exists
            delete dataToUpdate.id; 

            await updateDoc(studentRef, dataToUpdate);
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

    const handleAddAchievement = async (e) => {
        e.preventDefault();
        
        // Ensure all required fields are filled (Enrollment, Name, Achievement)
        if (!newAchievement.enrollment || !newAchievement.name || !newAchievement.achievement) {
            alert('Please fill out Enrollment No., Student Name, and Achievement field.');
            return;
        }
        
        // Ensure Branch, Year, Semester are optional for legacy records but preferred for new ones
        
        const newRecord = {
            ...newAchievement,
            // Parse ach_year to number only if it's provided
            ach_year: newAchievement.ach_year ? parseInt(newAchievement.ach_year, 10) : newAchievement.ach_year,
        };

        try {
            await addDoc(collection(db, 'extracurricular_records'), newRecord);
            alert('New achievement record added successfully!');
            setNewAchievement({
                enrollment: '',
                name: '',
                branch: '',
                year: '',
                semester: '',
                achievement: '',
                ach_year: '',
                proof_url: '',
            });
        } catch (error) {
            console.error('Error adding new achievement:', error);
            alert('Error adding new achievement. Check console for details.');
        }
    };

    const filteredData = achievementsData.filter(student => {
        // Robust filtering: check against empty string if the field is missing from student object
        const studentBranch = student.branch || '';
        const studentYear = student.year || '';
        const studentSemester = student.semester || '';

        return (
            (selectedBranch === '' || studentBranch === selectedBranch) &&
            (selectedYear === '' || studentYear === selectedYear) &&
            (selectedSemester === '' || studentSemester === selectedSemester)
        );
    });

    if (loading) {
        return <div className="loading">Loading records...</div>;
    }

    return (
        <div className="extracurricular-page-container">
            <div className="extracurricular-page-header">
                <h1>Extra Curricular Records</h1>
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

            <div className="add-record-form-container">
                <h2>Add New Achievement</h2>
                <form onSubmit={handleAddAchievement} className="add-record-form">
                    <input type="text" placeholder="Enrollment No." value={newAchievement.enrollment} onChange={(e) => setNewAchievement({ ...newAchievement, enrollment: e.target.value })} required />
                    <input type="text" placeholder="Student Name" value={newAchievement.name} onChange={(e) => setNewAchievement({ ...newAchievement, name: e.target.value })} required />
                    <input type="text" placeholder="Achievement" value={newAchievement.achievement} onChange={(e) => setNewAchievement({ ...newAchievement, achievement: e.target.value })} required />
                    <input type="number" placeholder="Year" value={newAchievement.ach_year} onChange={(e) => setNewAchievement({ ...newAchievement, ach_year: e.target.value })} />
                    <input type="text" placeholder="Proof URL (PDF/Image Link)" value={newAchievement.proof_url} onChange={(e) => setNewAchievement({ ...newAchievement, proof_url: e.target.value })} />
                    <select value={newAchievement.branch} onChange={(e) => setNewAchievement({ ...newAchievement, branch: e.target.value })}>
                        <option value="">Select Branch</option>
                        {branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                    </select>
                    <select value={newAchievement.year} onChange={(e) => setNewAchievement({ ...newAchievement, year: e.target.value })}>
                        <option value="">Select Year</option>
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                    <select value={newAchievement.semester} onChange={(e) => setNewAchievement({ ...newAchievement, semester: e.target.value })}>
                        <option value="">Select Semester</option>
                        {semesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}
                    </select>
                    <button type="submit" className="add-btn">Add Record</button>
                </form>
            </div>

            <div className="extracurricular-table-container">
                <h2>Student Achievements</h2>
                <table className="extracurricular-table">
                    <thead>
                        <tr>
                            <th>Enrollment No.</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>Field of Achievement</th>
                            <th>Year of Achievement</th>
                            <th>Proof of Achievement</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(student => (
                            <tr key={student.id}>
                                {editingId === student.id ? (
                                    <>
                                        {/* Editable Student Details */}
                                        <td><input type="text" value={editedData.enrollment} onChange={(e) => handleUpdateField('enrollment', e.target.value)} /></td>
                                        <td><input type="text" value={editedData.name} onChange={(e) => handleUpdateField('name', e.target.value)} /></td>
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
                                        
                                        {/* Editable Achievement Details */}
                                        <td><input type="text" value={editedData.achievement} onChange={(e) => handleUpdateField('achievement', e.target.value)} /></td>
                                        <td><input type="number" value={editedData.ach_year} onChange={(e) => handleUpdateField('ach_year', e.target.value)} /></td>
                                        <td><input type="text" value={editedData.proof_url} onChange={(e) => handleUpdateField('proof_url', e.target.value)} /></td>
                                        
                                        {/* Actions */}
                                        <td>
                                            <button className="save-btn" onClick={handleSave}>Save</button>
                                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        {/* Display Mode */}
                                        <td>{student.enrollment}</td>
                                        <td>{student.name}</td>
                                        <td>{student.branch}</td>
                                        <td>{student.year}</td>
                                        <td>{student.semester}</td>
                                        <td>{student.achievement}</td>
                                        <td>{student.ach_year}</td>
                                        <td>
                                            {student.proof_url ? (
                                                <a href={student.proof_url} target="_blank" rel="noopener noreferrer">View Proof</a>
                                            ) : ('-')}
                                        </td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEdit(student)}>Edit</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div className="no-data-message">
                        No extracurricular records found for the selected filters.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ExtraCurricularRecords;