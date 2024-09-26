import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../apis/api';
import { useAuth } from '../context/AuthContext';

interface Space {
  id: number;
  name: string;
}

const SpaceList: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const { token, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Wait for loading to complete

    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchSpaces = async () => {
      try {
        const response = await api.get('/space/getspaces', {
          headers: {
            Authorization: token,
          },
        });
        setSpaces(response.data.spaces);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
    };

    fetchSpaces();
  }, [token, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while retrieving the token
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Spaces</h1>
      <Link to="/create-space" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Create New Space
      </Link>
      <ul>
        {spaces.map((space) => (
          <li key={space.id} className="mb-2">
            <Link to={`/space/${space.id}`} className="text-blue-500 hover:underline">
              {space.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpaceList;