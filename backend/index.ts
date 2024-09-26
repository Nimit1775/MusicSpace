import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import UserRouter from './routes/UserRouter.js';
import SpaceRouter from './routes/SpaceRouter.js';
import MusicRouter from './routes/MusicRouter.js';

dotenv.config();
const app = express(); 
app.use(cors());
app.use(express.json());
const prisma = new PrismaClient();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  },
});

app.get('/' , (req, res) => {
    res.send('Hello World');
}) ;

app.use('/api/user' , UserRouter) ; 
app.use('/api/space' , SpaceRouter) ; 
app.use('/api/music' , MusicRouter) ; 

io.on('connection', (socket) => {
  socket.on('join_space', (spaceId) => {
    socket.join(spaceId);
  });

  socket.on('leave_space', (spaceId) => {
    socket.leave(spaceId);
  });
});
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_space', (spaceId) => {
    socket.join(spaceId);
    console.log(`User joined space: ${spaceId}`);
  });

  socket.on('leave_space', (spaceId) => {
    socket.leave(spaceId);
    console.log(`User left space: ${spaceId}`);
  });

  // Emit when a video is added to the queue
  socket.on('add_to_queue', (spaceId, video) => {
    io.to(spaceId).emit('update_queue', video);
  });

  // Emit when a video is removed from the queue
  socket.on('remove_from_queue', (spaceId, queueId) => {
    io.to(spaceId).emit('queue_removed', queueId);
  });

  // Emit when a video ends
  socket.on('video_ended', (spaceId, queueId) => {
    io.to(spaceId).emit('video_ended', queueId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 