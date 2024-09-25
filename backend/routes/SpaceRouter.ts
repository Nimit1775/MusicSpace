import express from 'express';
import { Router } from 'express';
import { createSpace, deleteSpace, getSpaces } from '../controllers/SpaceController.js';
import { authMiddleware } from '../middlewares/auth.js';

const SpaceRouter = Router(); 
SpaceRouter.use(authMiddleware) ; 
SpaceRouter.post('/create' , createSpace) ; 
SpaceRouter.get('/getspaces' , getSpaces) ; 
SpaceRouter.delete('/delete/:id' , deleteSpace)  ;  

export default SpaceRouter;