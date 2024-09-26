import React, { useEffect, useState } from 'react';
import { api } from '../apis/api';

interface QueueProps {
  spaceId: string;
}

const Queue: React.FC<QueueProps> = ({ spaceId }) => {
  const [queue, setQueue] = useState<any[]>([]);

  const fetchQueue = async () => {
    try {
      const response = await api.get(`/music/${spaceId}/queue`);
      setQueue(response.data.queue);
    } catch (error) {
      console.error('Fetch queue error', error);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [spaceId]);

  return (
    <div>
      <h2>Queue</h2>
      <ul>
        {queue.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Queue;
