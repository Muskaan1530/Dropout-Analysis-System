import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc, addDoc } from 'firebase/firestore';

const branches = ["IT", "CSE", "ECE", "ME"]; // Added ME branch
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const semesters = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"];

// Define subjects for each branch and semester
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


function ManageAttendance({ setCurrentPage }) {
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editedStudentData, setEditedStudentData] = useState({});

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

    const handleEdit = (student) => {
        setEditingId(student.id);
        setEditedStudentData({ ...student });
    };

    const handleSave = async (studentId) => {
        const studentRef = doc(db, 'attendance_records', studentId);

        const { id, ...dataToUpdate } = editedStudentData;
        
        // Ensure attended values are integers before saving
        Object.keys(dataToUpdate.subjects).forEach(subject => {
            dataToUpdate.subjects[subject].attended = parseInt(dataToUpdate.subjects[subject].attended) || 0;
        });

        try {
            await updateDoc(studentRef, dataToUpdate);
            console.log("Record updated successfully!");
            setEditingId(null);
            setEditedStudentData({});
        } catch (error) {
            console.error("Error updating record:", error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedStudentData({});
    };

    const handleUpdateStudentField = (field, value) => {
        setEditedStudentData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleUpdateSubjectAttendance = (subject, value) => {
        setEditedStudentData(prev => ({
            ...prev,
            subjects: {
                ...prev.subjects,
                [subject]: { ...prev.subjects[subject], attended: value }
            }
        }));
    };

    const handleAddStudent = async (e) => {
        e.preventDefault();
        
        if (!newStudent.enrollment || !newStudent.name || !newStudent.branch || !newStudent.year || !newStudent.semester) {
            alert('Please fill out all required fields: Enrollment, Name, Branch, Year, and Semester.');
            return;
        }
        
        const initialSubjects = {};
        const baseTotalClasses = 50; 
        
        const subjectKeys = getSubjectsForSemester(newStudent.branch, newStudent.semester);

        if (subjectKeys.length === 0) {
            alert('Could not determine subjects for the selected Branch and Semester combination.');
            return;
        }

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

    // --- LOGIC FOR DYNAMIC/GENERIC SUBJECT HEADERS ---
    let subjectOrder = [];
    if (selectedBranch && selectedSemester) {
        // Case 1: If filters are selected, use the actual subjects.
        subjectOrder = getSubjectsForSemester(selectedBranch, selectedSemester);
    } else if (filteredData.length > 0) {
        // Case 2: If no specific filters, use the subjects of the first displayed student 
        subjectOrder = Object.keys(filteredData[0].subjects);
    }

    // Determine the subject display names for the header
    const headerSubjectNames = subjectOrder.map((subject, index) => {
        // If no specific branch AND no specific semester is selected, show generic names
        if (!selectedBranch && !selectedSemester) {
            return `Subject ${index + 1}`;
        }
        // Otherwise, show the actual subject name
        return subject;
    });
    // -------------------------------------------------------------

    if (loading) {
        return <div className="loading">Loading attendance data...</div>;
    }

    // Determine if we should show subject columns at all (to avoid a huge empty table)
    const shouldShowSubjects = subjectOrder.length > 0;

    return (
        <div className="attendance-page-container">
            <div className="attendance-page-header">
                <h1>Manage Student Attendance</h1>
                <button className="back-btn" onClick={() => setCurrentPage('AdminDashboard')}>Back</button>
            </div>

            <div className="filter-section">
                {/* Filters remain the same */}
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

            <div className="attendance-table-container">
                <h2>Attendance Details</h2>
                <table className="attendance-table">
                    <thead>
                        {/* FIRST HEADER ROW: Main student details and dynamic/generic Subjects */}
                        <tr>
                            <th>Enrollment No.</th>
                            <th>Name</th>
                            <th>Branch</th>
                            <th>Year</th>
                            <th>Semester</th>
                            {shouldShowSubjects && headerSubjectNames.map(subjectName => (
                                <th key={subjectName} colSpan="2">{subjectName}</th>
                            ))}
                            <th>Actions</th>
                        </tr>
                        {/* SECOND HEADER ROW: Attended/Total and Status */}
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            {shouldShowSubjects && headerSubjectNames.map((_, index) => (
                                <React.Fragment key={`sub-header-${index}`}>
                                    <th>Attended/Total</th>
                                    <th>Status</th>
                                </React.Fragment>
                            ))}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(student => (
                            <tr key={student.id}>
                                {/* Student Details (Editable/Display) */}
                                {editingId === student.id ? (
                                    <>
                                        <td><input type="text" value={editedStudentData.enrollment || ''} onChange={(e) => handleUpdateStudentField('enrollment', e.target.value)} className="edit-input-small"/></td>
                                        <td><input type="text" value={editedStudentData.name || ''} onChange={(e) => handleUpdateStudentField('name', e.target.value)} className="edit-input-medium"/></td>
                                        <td><select value={editedStudentData.branch || ''} onChange={(e) => handleUpdateStudentField('branch', e.target.value)} className="edit-select">{branches.map(branch => <option key={branch} value={branch}>{branch}</option>)}</select></td>
                                        <td><select value={editedStudentData.year || ''} onChange={(e) => handleUpdateStudentField('year', e.target.value)} className="edit-select">{years.map(year => <option key={year} value={year}>{year}</option>)}</select></td>
                                        <td><select value={editedStudentData.semester || ''} onChange={(e) => handleUpdateStudentField('semester', e.target.value)} className="edit-select">{semesters.map(semester => <option key={semester} value={semester}>{semester}</option>)}</select></td>
                                    </>
                                ) : (
                                    <>
                                        <td>{student.enrollment}</td>
                                        <td>{student.name}</td>
                                        <td>{student.branch}</td>
                                        <td>{student.year}</td>
                                        <td>{student.semester}</td>
                                    </>
                                )}
                                
                                {/* Subject Attendance Details (CRITICAL FIX) */}
                                {subjectOrder.map((subjectKey, index) => {
                                    // Ensure we get the correct data using the subjectKey
                                    const data = student.subjects[subjectKey] || { attended: 0, total: 0 };
                                    
                                    const attendedInEdit = editingId === student.id 
                                        ? parseInt(editedStudentData.subjects?.[subjectKey]?.attended) || 0 
                                        : data.attended;

                                    const percentage = getAttendancePercentage(attendedInEdit, data.total);
                                    const statusClass = getAttendanceStatus(percentage);
                                    
                                    return (
                                        <React.Fragment key={`${student.id}-${subjectKey}-${index}`}>
                                            {editingId === student.id ? (
                                                <>
                                                    <td>
                                                        {/* Editable Attended Classes */}
                                                        <input
                                                            type="number"
                                                            value={editedStudentData.subjects?.[subjectKey]?.attended || 0}
                                                            onChange={(e) => handleUpdateSubjectAttendance(subjectKey, e.target.value)}
                                                            className="attendance-input"
                                                            min="0"
                                                            max={data.total}
                                                        />
                                                        / {data.total} ({percentage}%)
                                                    </td>
                                                    <td className={statusClass}>{statusClass === 'status-pass' ? 'Above 75%' : 'Below 75%'}</td>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Display Attended/Total */}
                                                    <td>{data.attended} / {data.total} ({percentage}%)</td>
                                                    <td className={statusClass}>{statusClass === 'status-pass' ? 'Above 75%' : 'Below 75%'}</td>
                                                </>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                                {/* Actions */}
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
                {filteredData.length === 0 && (selectedBranch || selectedSemester) && (
                    <div className="no-data-message">
                        No attendance records found for the selected filter combination.
                    </div>
                )}
                {filteredData.length === 0 && !selectedBranch && !selectedSemester && !loading && (
                    <div className="no-data-message">
                        No attendance records found. Add a new student above.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageAttendance;