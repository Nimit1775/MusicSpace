import express from 'express';
import { Router } from 'express';
import { addToQueue, getQueue, removeFromQueue, searchYouTube } from '../controllers/MusicController.js';
import { authMiddleware } from '../middlewares/auth.js';

const MusicRouter = Router();
MusicRouter.use(authMiddleware) ;
MusicRouter.get('/search' , searchYouTube) ; 
MusicRouter.post('/:id/add' , addToQueue) ; 
MusicRouter.get('/:id/queue' , getQueue) ;  
MusicRouter.delete('/:id/queue/:queueId' , removeFromQueue) ;

export default MusicRouter ;