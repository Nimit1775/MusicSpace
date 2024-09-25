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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}); 