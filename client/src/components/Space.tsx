import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../apis/api';
import YouTubePlayer from './YoutubePlayer';
import Queue from './Queue';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
}

interface QueueItem {
  id: number;
  music: {
    id: number;
    title: string;
    url: string;
  };
  order: number;
}

const Space: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(`isAuthenticated-${spaceId}`) === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<QueueItem | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchQueue();
    }
  }, [spaceId, isAuthenticated]);

  useEffect(() => {
    if (queue.length > 0 && !currentlyPlaying) {
      setCurrentlyPlaying(queue[0]);
    }
  }, [queue, currentlyPlaying]);

  const fetchQueue = async () => {
    try {
      const response = await api.get(`/music/${spaceId}/queue`);
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const response = await api.get(`/music/search`, { params: { query: searchQuery } });
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Search error', error);
    }
  };

  const handleJoinSpace = async () => {
    try {
      await api.post(`/space/join/${spaceId}`, { password });
      setIsAuthenticated(true);
      localStorage.setItem(`isAuthenticated-${spaceId}`, 'true');
    } catch (error) {
      console.error('Join space error', error);
    }
  };

  const addToQueue = async (video: Video) => {
    try {
      await api.post(`/music/${spaceId}/add`, { title: video.title, url: video.url });
      fetchQueue();
      setSearchQuery('');
      setVideos([]);
    } catch (error) {
      console.error('Add to queue error', error);
    }
  };

  const removeFromQueue = async (queueId: number) => {
    try {
      await api.delete(`/music/${spaceId}/queue/${queueId}`);
      fetchQueue();
    } catch (error) {
      console.error('Remove from queue error', error);
    }
  };

  const handleVideoEnd = async () => {
    if (currentlyPlaying) {
      try {
        await api.delete(`/music/${spaceId}/queue/${currentlyPlaying.id}`);
        setQueue((prevQueue) => {
          const newQueue = prevQueue.slice(1);
          setCurrentlyPlaying(newQueue[0] || null);
          return newQueue;
        });
        console.log('Playing next video:', queue[1]);
      } catch (error) {
        console.error('Error removing video from queue:', error);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Join Space: {spaceId}</h1>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button onClick={handleJoinSpace} className="bg-blue-500 text-white px-4 py-2 rounded">Join Space</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Space: {spaceId}</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search YouTube"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mr-2"
          required
        />
        <button onClick={handleSearch} className="bg-red-500 text-white px-4 py-2 rounded">Search</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {videos.map((video) => (
          <div key={video.url} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{video.title}</h3>
            <img src={video.thumbnail} alt={video.title} className="w-full mb-2" />
            <button onClick={() => addToQueue(video)} className="bg-green-500 text-white px-4 py-2 rounded">Add to Queue</button>
          </div>
        ))}
      </div>
      {currentlyPlaying && currentlyPlaying.music.url && (
        <YouTubePlayer
          videoId={currentlyPlaying.music.url.split('v=')[1]}
          onEnd={handleVideoEnd}
        />
      )}
      {spaceId && <Queue spaceId={spaceId} queue={queue} removeFromQueue={removeFromQueue} />}
    </div>
  );
};

export default Space;