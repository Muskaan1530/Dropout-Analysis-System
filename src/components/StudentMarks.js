import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const branches = ["IT", "CSE", "ECE", "ME"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

// Define subjects for each branch and semester (Copied from previous attendance logic)
const branchSemesterSubjects = {
    "1st Sem": {
        'ALL': ["Engineering Physics", "Engineering Chemistry"],
        'CSE': ["Programming for Problem Solving", "Basic Electrical Engineering"],
        'IT': ["Programming for Problem Solving", "Basic Electrical Engineering"],
        'ECE': ["Programming for Problem Solving", "Basic Electrical Engineering"],
        'ME': ["Engineering Graphics", "Basic Mechanical Engineering"],
    },
    "2nd Sem": {
        'ALL': ["Mathematics-II", "Environmental Science"],
        'CSE': ["Object Oriented Programming", "Data Structures"],
        'IT': ["Object Oriented Programming", "Data Structures"],
        'ECE': ["Electronic Devices", "Network Analysis"],
        'ME': ["Material Science", "Thermodynamics"],
    },
    "3rd Sem": {
        'ALL': ["Discrete Mathematics", "Engineering Economics"],
        'CSE': ["Database Management Systems", "Computer Organization"],
        'IT': ["Database Management Systems", "Operating Systems"],
        'ECE': ["Digital Electronics", "Signals and Systems"],
        'ME': ["Fluid Mechanics", "Manufacturing Processes"],
    },
    "4th Sem": {
        'ALL': ["Probability and Statistics", "Software Engineering"],
        'CSE': ["Operating Systems", "Design and Analysis of Algorithms"],
        'IT': ["Computer Networks", "Design and Analysis of Algorithms"],
        'ECE': ["Microcontrollers", "Analog and Digital Communication"],
        'ME': ["Kinematics of Machines", "Heat Transfer"],
    },
    "5th Sem": {
        'ALL': ["Professional Ethics", "Open Elective-I"],
        'CSE': ["Theory of Computation", "Compiler Design"],
        'IT': ["Information Security", "Web Technologies"],
        'ECE': ["VLSI Design", "Control Systems"],
        'ME': ["Dynamics of Machines", "Machine Design-I"],
    },
    "6th Sem": {
        'ALL': ["Cloud Computing", "Project Management"],
        'CSE': ["Artificial Intelligence", "Machine Learning"],
        'IT': ["Mobile Computing", "Data Warehousing"],
        'ECE': ["Digital Signal Processing", "Microwave Engineering"],
        'ME': ["Internal Combustion Engines", "Operations Research"],
    },
    "7th Sem": {
        'ALL': ["Humanities Elective", "Major Project-I"],
        'CSE': ["Cryptography", "Deep Learning"],
        'IT': ["Big Data Analytics", "IoT"],
        'ECE': ["Optical Fiber Communication", "Embedded Systems"],
        'ME': ["CAD/CAM", "Refrigeration and Air Conditioning"],
    },
    "8th Sem": {
        'ALL': ["Minor Project", "Internship/Training"],
        'CSE': ["Distributed Systems", "Natural Language Processing"],
        'IT': ["Cyber Security", "Ethical Hacking"],
        'ECE': ["Wireless Communication", "Satellite Communication"],
        'ME': ["Automobile Engineering", "Robotics"],
    },
};

// Helper function to get subjects based on branch and semester
const getSubjectsForSemester = (branch, semester) => {
    if (!branch || !semester || !branchSemesterSubjects[semester]) {
        return [];
    }
    const common = branchSemesterSubjects[semester]['ALL'] || [];
    const branchSpecific = branchSemesterSubjects[semester][branch] || [];
    return [...new Set([...common, ...branchSpecific])];
};


function StudentMarks({ setCurrentPage }) {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [studentMarksData, setStudentMarksData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editedData, setEditedData] = useState({});

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

        // onSnapshot handles real-time updates from Firestore (low latency update)
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

    const handleAddStudent = async (e) => {
        e.preventDefault();
        
        if (!newStudent.enrollment || !newStudent.name || !newStudent.branch || !newStudent.year || !newStudent.semester) {
            alert('Please fill out all required fields: Enrollment, Name, Branch, Year, and Semester.');
            return;
        }

        const initialSubjects = {};
        
        const subjectKeys = getSubjectsForSemester(newStudent.branch, newStudent.semester);
        
        if (subjectKeys.length === 0) {
            alert('Could not determine subjects for the selected Branch and Semester combination. Please ensure the combination is valid.');
            return;
        }

        subjectKeys.forEach(subject => {
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
        // --- FIX: Safely access student properties for robust filtering ---
        const studentBranch = student.branch || '';
        const studentYear = student.year || '';
        const studentSemester = student.semester || '';

        return (
            (selectedBranch === '' || studentBranch === selectedBranch) &&
            (selectedYear === '' || studentYear === selectedYear) &&
            (selectedSemester === '' || studentSemester === selectedSemester)
        );
    });
    
    const handleEdit = (student) => {
        setEditingId(student.id);
        setEditedData(student);
    };
    
    const handleSave = async () => {
        const studentRef = doc(db, 'student_marks', editingId);
        
        try {
            const updatedSubjects = Object.fromEntries(
                Object.entries(editedData.subjects).map(([subject, marks]) => [
                    subject, 
                    parseInt(marks, 10) || 0
                ])
            );
            
            const dataToUpdate = {
                enrollment: editedData.enrollment,
                name: editedData.name,
                branch: editedData.branch,
                year: editedData.year,
                semester: editedData.semester,
                subjects: updatedSubjects,
            };

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
        // Handle subject structure change if branch or semester changes
        if (field === 'branch' || field === 'semester') {
            const newBranch = field === 'branch' ? value : editedData.branch;
            const newSemester = field === 'semester' ? value : editedData.semester;
            
            const newSubjects = getSubjectsForSemester(newBranch, newSemester);
            const newSubjectsObject = newSubjects.reduce((acc, subject) => {
                acc[subject] = editedData.subjects[subject] !== undefined ? editedData.subjects[subject] : 0;
                return acc;
            }, {});
            
            setEditedData(prev => ({
                ...prev,
                [field]: value,
                subjects: newSubjectsObject,
            }));
        } else {
            setEditedData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };
    
    const handleUpdateSubjectMarks = (subject, value) => {
        setEditedData(prev => ({
            ...prev,
            subjects: {
                ...prev.subjects,
                [subject]: value
            }
        }));
    };

    // --- Dynamic Header Logic ---
    let subjectOrder = [];
    let headerSubjectNames = [];

    if (selectedBranch && selectedSemester) {
        subjectOrder = getSubjectsForSemester(selectedBranch, selectedSemester);
        headerSubjectNames = subjectOrder;
    } else if (filteredData.length > 0) {
        subjectOrder = Object.keys(filteredData[0].subjects);
        headerSubjectNames = subjectOrder.map((_, index) => `Subject ${index + 1}`);
    } else {
        headerSubjectNames = ["Subject 1", "Subject 2", "Subject 3", "Subject 4"];
        subjectOrder = headerSubjectNames; // Use generic names for key lookup if table is empty
    }


    if (loading) {
        return <div className="loading">Loading student marks data...</div>;
    }

    return (
        <div className="marks-page-container">
            <div className="marks-page-header">
                <h1>Student Marks Details</h1>
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
                    <input type="text" placeholder="Enrollment No." value={newStudent.enrollment} onChange={(e) => setNewStudent({ ...newStudent, enrollment: e.target.value })} required />
                    <input type="text" placeholder="Student Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} required />
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
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Semester</th>
                            {headerSubjectNames.map((subjectName, index) => (
                                <th key={index}>{subjectName}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(student => (
                            <tr key={student.id}>
                                {editingId === student.id ? (
                                    <>
                                        {/* Editable Student Details */}
                                        <td><input type="text" value={editedData.enrollment} onChange={(e) => handleUpdateField('enrollment', e.target.value)} className="edit-input-small" /></td>
                                        <td><input type="text" value={editedData.name} onChange={(e) => handleUpdateField('name', e.target.value)} className="edit-input-medium" /></td>
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
                                        
                                        {/* Editable Marks - Uses subjectOrder for column structure */}
                                        {subjectOrder.map((subjectKey, index) => {
                                            const marks = editedData.subjects[subjectKey] !== undefined ? editedData.subjects[subjectKey] : ''; 
                                            return (
                                                <td key={index}>
                                                    <input
                                                        type="number"
                                                        value={marks}
                                                        onChange={(e) => handleUpdateSubjectMarks(subjectKey, e.target.value)}
                                                        className="marks-input"
                                                        min="0"
                                                        max="100"
                                                    />
                                                </td>
                                            );
                                        })}
                                        
                                        {/* Actions */}
                                        <td>
                                            <button className="save-btn" onClick={handleSave}>Save</button>
                                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        {/* Display Mode (FIXED: Branch column added and all fields displayed) */}
                                        <td>{student.enrollment}</td>
                                        <td>{student.name}</td>
                                        <td>{student.branch}</td> 
                                        <td>{student.year}</td>
                                        <td>{student.semester}</td>
                                        
                                        {/* Display Marks - Uses subjectOrder for column structure */}
                                        {subjectOrder.map((subjectKey, index) => {
                                            const mark = student.subjects[subjectKey];
                                            const isFailing = mark < 40;
                                            return (
                                                <td 
                                                    key={index} 
                                                    className={mark !== undefined && isFailing ? 'marks-fail' : 'marks-pass'}
                                                >
                                                    {mark !== undefined ? mark : '-'}
                                                </td>
                                            );
                                        })}
                                        
                                        {/* Actions */}
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
                        No student marks records found for the selected filters.
                    </div>
                )}
            </div>
        </div>
    );
}

export default StudentMarks;