// ViewTrains.js
import React, { useEffect, useState } from 'react';
import './Admin.css'; 

const ViewTrains = () => {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrains = async () => {
            try {
                const response = await fetch('https://irctcback-1.onrender.com/get-trains');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTrains(data); 
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTrains();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className='list-heading'>
            <h3>Train List</h3>
            </div>
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
                        <th>Total Seats</th>
                    </tr>
                </thead>
                <tbody>
                    {trains.map((train, index) => (
                        <tr key={index}>
                            <td>{train.trainName}</td>
                            <td>{train.source}</td>
                            <td>{train.destination}</td>
                            <td>{train.departureTime}</td>
                            <td>{train.arrivalTime}</td>
                            <td>{new Date(train.departureDate).toLocaleDateString()}</td>
                            <td>{new Date(train.arrivalDate).toLocaleDateString()}</td>
                            <td>{train.seats}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewTrains;
