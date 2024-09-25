import brcypt from 'bcryptjs';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const prisma = new PrismaClient();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET  ; 
