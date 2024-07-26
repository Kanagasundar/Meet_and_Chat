import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Interest = () => {
    const { user } = useContext(AuthContext);
    const [interests, setInterests] = useState([]);
    const [otherUsername, setOtherUsername] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('http://localhost:8000/csrf/', {
                    credentials: 'include',
                });
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('Error fetching CSRF token:', error);
            }
        };

        if (user && user.access) {
            fetchCsrfToken();
        }
    }, [user]);

    useEffect(() => {
        const fetchInterests = async () => {
            if (user && user.access) {
                try {
                    const response = await fetch('http://localhost:8000/api/interests/', {
                        headers: { 'Authorization': `Bearer ${user.access}` },
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setInterests(data.interests);
                } catch (error) {
                    console.error('Error fetching interests:', error);
                }
            }
        };

        fetchInterests();
    }, [user]);

    const sendInterest = async () => {
        if (user && user.access && otherUsername.trim() !== '') {
            try {
                const response = await fetch('http://localhost:8000/api/interests/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.access}`,
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ receiver: otherUsername }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setOtherUsername('');

                // Fetch updated interests list
                const updatedResponse = await fetch('http://localhost:8000/api/interests/', {
                    headers: { 'Authorization': `Bearer ${user.access}` },
                    credentials: 'include',
                });
                if (!updatedResponse.ok) {
                    throw new Error('Network response was not ok');
                }
                const updatedInterests = await updatedResponse.json();
                setInterests(updatedInterests.interests);
            } catch (error) {
                console.error('Error sending interest:', error);
            }
        }
    };

    const handleAccept = async (username) => {
        if (user && user.access) {
            try {
                const response = await fetch(`http://localhost:8000/api/interests/accept/${username}/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${user.access}`,
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Remove accepted interest from the list
                setInterests(interests.filter(interest => interest.sender !== username));
                // Navigate to the chat interface with the username
                navigate(`/chat/${username}`);
            } catch (error) {
                console.error('Error accepting interest:', error);
            }
        }
    };

    const handleReject = async (username) => {
        if (user && user.access) {
            try {
                const response = await fetch(`http://localhost:8000/api/interests/reject/${username}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.access}`,
                        'X-CSRFToken': csrfToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({ receiver: username }),
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setInterests(interests.filter(interest => interest.sender !== username));
            } catch (error) {
                console.error('Error rejecting interest:', error);
            }
        }
    };

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={() => navigate('/users')}>Back to User List</button>
            <h2>Send Interest to a User</h2>
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    value={otherUsername}
                    onChange={(e) => setOtherUsername(e.target.value)}
                />
                <button className="btn btn-primary" onClick={sendInterest}>Send</button>
            </div>
            <h2>Received Interests</h2>
            <ul className="list-group">
                {interests.map((interest) => (
                    <li key={interest.sender} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>User {interest.sender}</span>
                        <div>
                            <button className="btn btn-success me-2" onClick={() => handleAccept(interest.sender)}>Accept</button>
                            <button className="btn btn-danger" onClick={() => handleReject(interest.sender)}>Reject</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Interest;
