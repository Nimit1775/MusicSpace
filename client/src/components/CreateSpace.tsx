import React, { useState } from 'react';
import { api } from '../apis/api';

const CreateSpace: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/space/create', { name, password });
      alert('Space created successfully');
      // Optional: Redirect to the newly created space or refresh
    } catch (error) {
      console.error('Error creating space', error);
    }
  };

  return (
    <div>
      <h2>Create Space</h2>
      <form onSubmit={handleCreateSpace}>
        <input
          type="text"
          placeholder="Space Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateSpace;
