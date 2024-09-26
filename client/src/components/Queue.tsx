import React from 'react';
interface QueueItem {
  id: number;
  music: {
    id: number;
    title: string;
    url: string;
  };
  order: number;
}

interface QueueProps {
  spaceId: string;
  queue: QueueItem[];
  removeFromQueue: (queueId: number) => void;
}

const Queue: React.FC<QueueProps> = ({ spaceId, queue, removeFromQueue }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Queue for Space {spaceId}</h2>
      <ul className="space-y-2">
        {queue.map((item) => (
          <li key={item.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
            <span>{item.music.title}</span>
            <button
              onClick={() => removeFromQueue(item.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Queue;
