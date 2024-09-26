import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTubePlayer from './YoutubePlayer';
import Queue from './Queue';
import { api } from '../apis/api';

const Space: React.FC = () => {
  const { spaceId } = useParams<{ spaceId: string }>(); // Ensure spaceId is properly extracted
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [playingVideoId, setPlayingVideoId] = useState('');

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
    } catch (error) {
      console.error('Join space error', error);
    }
  };

  const addToQueue = async (video: any) => {
    try {
      const response = await api.post(`/music/${spaceId}/add`, { title: video.title, url: video.url });
      setPlayingVideoId(video.id); // Automatically play the added video
    } catch (error) {
      console.error('Add to queue error', error);
    }
  };

  useEffect(() => {
    if (spaceId) {
      // You can trigger space-specific logic here if necessary
    }
  }, [spaceId]);

  return (
    <div>
      <h1>Space: {spaceId}</h1>
      {!isAuthenticated ? (
        <div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button onClick={handleJoinSpace}>Join Space</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Search YouTube"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            required
          />
          <button onClick={handleSearch}>Search</button>
          <div>
            {videos.map((video) => (
              <div key={video.id}>
                <h3>{video.title}</h3>
                <button onClick={() => addToQueue(video)}>Add to Queue</button>
              </div>
            ))}
          </div>
          {playingVideoId && <YouTubePlayer videoId={playingVideoId} />}
          <Queue spaceId={spaceId} />
        </div>
      )}
    </div>
  );
};

export default Space;
