import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const searchYouTube = async (req: Request, res: Response) => {
  const { query, pageToken, maxResults = 10 } = req.query;
  const apiKey = process.env.YOUTUBE_API;

  // Input validation
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing query parameter' });
  }

  if (maxResults && (isNaN(Number(maxResults)) || Number(maxResults) < 1 || Number(maxResults) > 50)) {
    return res.status(400).json({ error: 'maxResults must be a number between 1 and 50' });
  }

  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          key: apiKey,
          maxResults: maxResults,
          pageToken: pageToken || undefined
        }
      }
    );

    const videos = response.data.items.map((item: any) => ({
      title: item.snippet.title,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      thumbnail: item.snippet.thumbnails.default.url,
    }));

    res.json({
      videos,
      nextPageToken: response.data.nextPageToken,
      prevPageToken: response.data.prevPageToken,
      totalResults: response.data.pageInfo.totalResults
    });
  } catch (error) {
    console.error('YouTube API error:', error);
    res.status(500).json({ error: 'Failed to search YouTube videos' });
  }
};


// Add music to the queue for a specific space
export const addToQueue = async (req: Request, res: Response) => {
  const { id } = req.params; // space ID
  const { title, url } = req.body;

  try {
    const space = await prisma.space.findUnique({ where: { id: parseInt(id) } });
    if (!space) return res.status(404).json({ error: 'Space not found' });

    // Check if the music already exists in the database
    let music = await prisma.music.findFirst({ where: { url } });
    if (!music) {
      // Create new music entry if it doesn't exist
      music = await prisma.music.create({ data: { title, url } });
    }

    const queueCount = await prisma.queue.count({ where: { spaceId: parseInt(id) } });

    const queue = await prisma.queue.create({
      data: {
        musicId: music.id,
        spaceId: parseInt(id),
        order: queueCount + 1, // Add to the end of the queue
      },
    });

    res.json(queue);
  } catch (error) {
    console.error('Error adding to queue:', error);
    res.status(500).json({ error: 'Failed to add music to queue' });
  }
};

// Get all music in a queue for a specific space
export const getQueue = async (req: Request, res: Response) => {
  const { id } = req.params; // space ID

  try {
    const space = await prisma.space.findUnique({
      where: { id: parseInt(id) },
      include: {
        queue: {
          include: {
            music: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!space) {
      return res.status(404).json({ error: 'Space not found' });
    }

    res.json(space.queue);
  } catch (error) {
    console.error('Error retrieving queue:', error);
    res.status(500).json({ error: 'Failed to retrieve queue' });
  }
};

// Delete music from the queue
export const removeFromQueue = async (req: Request, res: Response) => {
  const { id, queueId } = req.params; // space ID and queue ID

  try {
    const queue = await prisma.queue.findUnique({ where: { id: parseInt(queueId) } });
    if (!queue) return res.status(404).json({ error: 'Queue item not found' });

    await prisma.queue.delete({ where: { id: parseInt(queueId) } });

    res.json({ message: 'Removed from queue' });
  } catch (error) {
    console.error('Error removing from queue:', error);
    res.status(500).json({ error: 'Failed to remove from queue' });
  }
};
