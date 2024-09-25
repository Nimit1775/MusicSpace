import express from 'express';
import { Router } from 'express';
import { login, signup } from '../controllers/AuthController.js';
 
const UserRouter = Router();

UserRouter.post('/signup' , signup) ; 
UserRouter.post('/login' , login) ; 

export default UserRouter ;
