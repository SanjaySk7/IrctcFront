// Admin.js
import React, { useState } from 'react';
import "./Admin.css";
import ViewTrains from './viewtrains';
import LogoutModal from '../../Component/logoutmodal';
import { useNavigate } from 'react-router-dom'; 

const Admin = () => {
    const [showAddTrainForm, setShowAddTrainForm] = useState(false);
    const [showViewTrains, setShowViewTrains] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        trainName: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        departureDate: '',
        arrivalDate: '',
        seats: ''
    });
    
    const  navigate= useNavigate(); 

    const handleAddTrainClick = () => {
        setShowAddTrainForm(true);
        setShowViewTrains(false);
    };

    const handleViewTrainsClick = () => {
        setShowAddTrainForm(false);
        setShowViewTrains(true);
    };

    const handleLogout = () => {
        setShowModal(true); 
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://irctcback-1.onrender.com/add-train', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.Message); 
                setFormData({
                    trainName: '',
                    source: '',
                    destination: '',
                    departureTime: '',
                    arrivalTime: '',
                    departureDate: '',
                    arrivalDate: '',
                    seats: ''
                });
            } else {
                alert(data.Message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error submitting form");
        }
    };

    const handleConfirmLogout = () => {
        setShowModal(false); 
        navigate('/'); 
    };

    const handleCancelLogout = () => {
        setShowModal(false);
    };

    return (
        <div>
            <div className='admin-container'>
                <h2 className='admin-heading'>Welcome Admin!</h2>
            <nav className="admin-nav">
                <button onClick={handleAddTrainClick}>Add Trains</button>
                <button onClick={handleViewTrainsClick}>View Trains</button>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            {showAddTrainForm && (
                <form className="add-train-form" onSubmit={handleSubmit}>
                    <label>
                        Train Name:
                        <input type="text" name="trainName" value={formData.trainName} onChange={handleChange} required />
                    </label>

                    <label>
                        Source:
                        <input type="text" name="source" value={formData.source} onChange={handleChange} required />
                    </label>

                    <label>
                        Destination:
                        <input type="text" name="destination" value={formData.destination} onChange={handleChange} required />
                    </label>

                    <label>
                        Departure Time:
                        <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} required />
                    </label>

                    <label>
                        Arrival Time:
                        <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required />
                    </label>

                    <label>
                        Departure Date:
                        <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} required />
                    </label>

                    <label>
                        Arrival Date:
                        <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} required />
                    </label>

                    <label>
                        Total Seats:
                        <input type="number" name="seats" value={formData.seats} onChange={handleChange} required min="1" />
                    </label>

                    <button type="submit">Submit</button>
                </form>
            )}

            {showViewTrains && <ViewTrains />} 
            {showModal && (
                <LogoutModal 
                    message="Are you sure you want to logout?"
                    onClose={handleCancelLogout}
                    onConfirm={handleConfirmLogout}
                />
            )}
        </div>
        </div>
    );
};

export default Admin;
