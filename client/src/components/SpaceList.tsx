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
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }

    const fetchSpaces = async () => {
      try {
        const response = await api.get('/space/getspaces');
        setSpaces(response.data.spaces);
      } catch (error) {
        console.error('Error fetching spaces', error);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchSpaces();
  }, [token, navigate]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Music Spaces</h1>
      <Link to="/create-space" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Create New Space
      </Link>
      {spaces.length === 0 ? (
        <p className="text-gray-600">You haven't created any spaces yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <Link key={space.id} to={`/space/${space.id}`} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold">{space.name}</h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default SpaceList;
