import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient(); 

export const createSpace = async ( req : Request , res : Response )=>  { 

    const { name , password} = req.body ;  
    if (!req.user) {
        return res.status(401).json({ error : 'Unauthorized' });
    }
    const hashedPassword = await bcrypt.hash(password , 10) ;
    const space = await prisma.space.create({
        data : {
            name , 
            password : hashedPassword ,  
            ownerId: req.user.userId  
        }   
    }); 
    res.status(200).json({space});

}

export const getSpaces = async ( req : Request , res : Response )=>  { 
    if (!req.user) {
        return res.status(401).json({ error : 'Unauthorized' });
    }
    const spaces = await prisma.space.findMany({
        where : {
            ownerId : req.user.userId
        }
    });
    res.status(200).json({spaces});
}

export const joinSpace = async (req: Request, res: Response) => {
    const { spaceId } = req.params;
    const { password } = req.body;
  
    try {
      const space = await prisma.space.findUnique({
        where: { id: parseInt(spaceId) }
      });
      if (!space) {
        return res.status(404).json({ error: 'Space not found' });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, space.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      res.status(200).json({ message: 'Authenticated successfully' });
    } catch (error) {
      console.error('Error joining space:', error);
      res.status(500).json({ error: 'Failed to join space' });
    }
  };
  

export const deleteSpace = async ( req : Request , res : Response )=>  { 
    const { id } = req.params ; 
    if (!req.user) {
        return res.status(401).json({ error : 'Unauthorized' });
    }
    const space = await prisma.space.findFirst({
        where : {
            id : parseInt(id) , 
            ownerId : req.user.userId
        }
    });
    if (!space) {
        return res.status(404).json({ error : 'Space not found' });
    }
    await prisma.space.delete({
        where : {
            id : parseInt(id)
        }
    });
    res.status(200).json({message : 'Space deleted successfully'});
}

