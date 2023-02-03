import { NextFunction, Response } from 'express';
import { CustomRequest } from '../models/extras.model';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { PrismaClient } from '@prisma/client';
import roles from '../roles';

const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    const bearerToken = authorization?.split(' ') || '';
    const prismaInst = new PrismaClient();
    const token = bearerToken[1];

    if (token) {
      //Validar
      const decodedInfo: any = jwt.verify(
        token,
        String(process.env.JWT_SECRET)
      );
      const today = moment().unix();
      const expirationDate = decodedInfo?.exp;
      //Extra validation
      const user = await prismaInst.user.findFirst({
        where: { id: decodedInfo.userId },
      });

      if (today > expirationDate || !user?.accessToken) {
        return res.status(400).send({ message: 'Token now allowed' });
      } else {
        req.user = { id: user.id, role: user.role };
        next();
      }
    } else {
      return res.status(400).send({ message: 'Missing token' });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
};

const verifyRole = (action: string, resource: any) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user?.role)
      return res.status(400).send({ message: 'Unexpected role' });

    const permission: any = roles.can(req.user.role);
    const granted = permission[action](resource).granted;

    if (!granted) {
      return res.status(400).send({ message: 'Missing access' });
    }
    next();
  };
};

export { verifyToken, verifyRole };
