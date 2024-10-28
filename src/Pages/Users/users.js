import React, { useState, useEffect } from 'react';
import './Users.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutModal from '../../Component/logoutmodal';

const Users = () => {
  const [showBookTrains, setShowBookTrains] = useState(false);
  const [showViewBookings, setShowViewBookings] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fromStation: '',
    toStation: '',
  });
  const [trainDetails, setTrainDetails] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState(''); 

  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`https://irctcback-1.onrender.com/user/${userId}`);
        setUsername(response.data.userName); 
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [userId]);

  const handleBookTrainsClick = () => {
    setShowBookTrains(true);
    setShowViewBookings(false);
    setTrainDetails([]);
    setErrorMessage('');
  };

  const handleViewBookingsClick = () => {
    setShowBookTrains(false);
    setShowViewBookings(true);
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
      const response = await axios.get(`https://irctcback-1.onrender.com/get-trains/${formData.fromStation}/${formData.toStation}`);
      if (response.data.length > 0) {
        setTrainDetails(response.data);
        setErrorMessage('');
      } else {
        setTrainDetails([]);
        setErrorMessage('No trains present on this route.');
      }
    } catch (error) {
      console.error("Error fetching trains:", error);
      setErrorMessage('Error fetching trains.');
    }
  };

  const handleBookTrain = async (trainId) => {
    try {
      console.log("Booking train with ID:", trainId, "for user ID:", userId);
      const response = await axios.post(`https://irctcback-1.onrender.com/book-train`, { trainId, userId });
      alert(response.data.Message);
      fetchUserBookings();
    } catch (error) {
      console.error("Error booking train:", error);
    }
  };

  const fetchUserBookings = async () => {
    try {
      const response = await axios.get(`https://irctcback-1.onrender.com/${userId}`);
      setUserBookings(response.data);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }
  };

  useEffect(() => {
    if (showViewBookings) {
      fetchUserBookings();
    }
  }, [showViewBookings]);

  const handleConfirmLogout = () => {
    localStorage.removeItem('userId');
    setShowModal(false);
    navigate('/');
  };

  const handleCancelLogout = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <div className="heading-dashboard">
        <h2 className='user-heading'>Welcome {username}</h2> 
      </div>
      <nav className="user-nav">
        <button onClick={handleBookTrainsClick}>Book Trains</button>
        <button onClick={handleViewBookingsClick}>View Bookings</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      {showBookTrains && (
        <div className="booking-container">
          <div className='booking-heading'>
            <h3>Book Trains</h3>
          </div>
          <form onSubmit={handleSubmit} className="users-form">
            <label>
              From Station:
              <input type="text" name="fromStation" value={formData.fromStation} onChange={handleChange} required />
            </label>
            <label>
              To Station:
              <input type="text" name="toStation" value={formData.toStation} onChange={handleChange} required />
            </label>
            <button type="submit">Get Trains</button>
          </form>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

          {trainDetails.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Train Name</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Departure Time</th>
                  <th>Arrival Time</th>
                  <th>Departure Date</th>
                  <th>Arrival Date</th>
                  <th>Seats Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {trainDetails.map((train) => (
                  <tr key={train.train_id}>
                    <td>{train.trainName}</td>
                    <td>{train.source}</td>
                    <td>{train.destination}</td>
                    <td>{train.departureTime}</td>
                    <td>{train.arrivalTime}</td>
                    <td>{new Date(train.departureDate).toLocaleDateString()}</td>
                    <td>{new Date(train.arrivalDate).toLocaleDateString()}</td>
                    <td>{train.seats}</td>
                    <td>
                      <button onClick={() => handleBookTrain(train.train_id)} disabled={train.seats <= 0}>
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showViewBookings && (
        <div>
          <div className='yourbooking-heading'>
            <h3>Your Bookings</h3>
          </div>
          {userBookings.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Train Name</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Departure Time</th>
                  <th>Arrival Time</th>
                  <th>Seats Booked</th>
                </tr>
              </thead>
              <tbody>
                {userBookings.map((booking) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.trainName}</td>
                    <td>{booking.source}</td>
                    <td>{booking.destination}</td>
                    <td>{booking.departureTime}</td>
                    <td>{booking.arrivalTime}</td>
                    <td>1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className='your-heading'>
              <p>No bookings found.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <LogoutModal
          message="Are you sure you want to logout?"
          onClose={handleCancelLogout}
          onConfirm={handleConfirmLogout}
        />
      )}
    </div>
  );
};

export default Users;
