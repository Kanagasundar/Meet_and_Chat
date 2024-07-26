import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Interest from './Interest';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchUsers = async () => {
            if (user && user.access) {
                try {
                    const response = await fetch('/api/users/', {  // Notice the relative URL
                        headers: { 'Authorization': `Bearer ${user.access}` },
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setUsers(data);
                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            }
        };

        fetchUsers();
    }, [user]);

    if (selectedUser) {
        return <Interest selectedUser={selectedUser} goBack={() => setSelectedUser(null)} />;
    }

    return (
        <div className="container mt-5">
            <h2>User List</h2>
            <ul className="list-group">
                {users.map(user => (
                    <li key={user.username} className="list-group-item">
                        <button className="btn btn-link" onClick={() => setSelectedUser(user.username)}>{user.username}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Users;
