import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Chat = () => {
    const { username } = useParams();
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiverId, setReceiverId] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            if (user && user.access) {
                try {
                    const response = await fetch(`http://localhost:8000/api/messages/?username=${username}`, {
                        headers: { 'Authorization': `Bearer ${user.access}` },
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setMessages(data.messages || []);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        };

        fetchMessages();
    }, [username, user]);

    useEffect(() => {
        const fetchReceiverId = async () => {
            if (user && user.access) {
                try {
                    const response = await fetch(`http://localhost:8000/api/users/?username=${username}`, {
                        headers: { 'Authorization': `Bearer ${user.access}` },
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setReceiverId(data.id);
                } catch (error) {
                    console.error('Error fetching receiver ID:', error);
                }
            }
        };

        fetchReceiverId();
    }, [username, user]);

    const handleSendMessage = async () => {
        if (user && user.access && newMessage.trim() !== '') {
            const messagePayload = { receiver: username, text: newMessage };
            console.log('Sending message payload:', messagePayload); // Log payload
            try {
                const response = await fetch('http://localhost:8000/api/messages/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.access}`,
                    },
                    credentials: 'include',
                    body: JSON.stringify(messagePayload),
                });
                if (!response.ok) {
                    const errorData = await response.json(); // Log error details
                    console.error('Error sending message:', errorData);
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setNewMessage('');
                setMessages(prevMessages => [...prevMessages, data]);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };
    
    

    return (
        <div className="container">
            <h2 className="mt-3">Chat with {username}</h2>
            <ul className="list-group mb-3">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <li key={index} className="list-group-item">{message.text}</li>
                    ))
                ) : (
                    <li className="list-group-item">No messages found</li>
                )}
            </ul>
            <textarea
                className="form-control mb-2"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message here..."
            />
            <button className="btn btn-primary" onClick={handleSendMessage}>Send</button>
        </div>
    );
};

export default Chat;
