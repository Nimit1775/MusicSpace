import React, { useEffect, useRef } from 'react';

// Declare the YouTube API types for TypeScript
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  onEnd: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onEnd }) => {
  const playerRef = useRef<YT.Player | null>(null);

  useEffect(() => {
    // Load the IFrame Player API code asynchronously.
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    // This function creates an <iframe> (and YouTube player)
    // after the API code downloads.
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: videoId,
        events: {
          onReady: (event) => {
            console.log('Player ready:', event);
            event.target.playVideo();
          },
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.ENDED) {
              console.log('Video ended');
              onEnd();
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && videoId) {
      console.log('Updating videoId:', videoId);
      playerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  return <div id="player"></div>;
};

export default YouTubePlayer;