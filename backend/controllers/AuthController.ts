import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import dotenv from 'dotenv';


const prisma = new PrismaClient();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET  ; 

export const signup = async (req : Request , res : Response )=>{
    const { email , password } = req.body ;
    const hashedPassword = await bcrypt.hash(password , 10)  ; 
    try  { 
        const user = await prisma.user.create({
            data : {
                email , 
                password : hashedPassword
            }
        })
        const token = jwt.sign( { userId : user.id } , JWT_SECRET || "" ) ;
        res.status(200).json({token});
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
}; 

export const login = async ( req : Request , res : Response )=> {
     const { email , password } = req.body ; 
        const user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid Credentials' });
        }
        
        const token = jwt.sign( { userId : user.id } , JWT_SECRET || "" ) ;
        res.status(200).json({token});

}; 

