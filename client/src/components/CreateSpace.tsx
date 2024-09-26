import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../apis/api';
import { useAuth } from '../context/AuthContext';

const CreateSpace: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/auth');
    }
  }, [token, navigate]);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/space/create', { name, password });
      alert('Space created successfully');
      navigate(`/space/${response.data.space.id}`);
    } catch (error) {
      console.error('Error creating space', error);
      alert('Failed to create space. Please try again.');
    }
  };

  if (!token) {
    return null; // or a loading spinner
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Space</h2>
      <form onSubmit={handleCreateSpace} className="space-y-4">
        <input
          type="text"
          placeholder="Space Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  );
};

export default CreateSpace;
