import { Request, Response } from 'express';
import { CustomRequest } from '../models/extras.model';
import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { validatePassword, hashPassword } from '../utils/helpers';
import { Roles } from '../models/user.model';

@Service()
class UserController {
  private prismaInst: PrismaClient;

  constructor() {
    this.prismaInst = new PrismaClient();
  }

  signUp = async (req: Request, res: Response) => {
    try {
      const { email, name, password, role } = req.body;
      if (!email || !name || !password)
        return res
          .status(400)
          .send({ message: 'Missing params: name, email or passw' });

      const hashedPassword: string = await hashPassword(password);
      const newUser = await this.prismaInst.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: role || Roles.client,
        },
      });
      const accessToken: string = jwt.sign(
        { userId: newUser.id },
        String(process.env.JWT_SECRET),
        { expiresIn: '5d' }
      );
      await this.prismaInst.user.update({
        where: { id: newUser.id },
        data: { accessToken },
      });

      return res.status(200).send({
        data: { email: newUser.email, name: newUser.name, role: newUser.role },
        accessToken,
      });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res
          .status(400)
          .send({ message: 'Missing params: email or passw' });

      const user = await this.prismaInst.user.findFirst({ where: { email } });
      if (!user)
        return res.status(404).send({ message: "Email doesn't exist" });

      const isPasswordValid = await validatePassword(password, user.password);
      if (!isPasswordValid)
        return res.status(400).send({ message: 'Invalid password' });

      const accessToken = jwt.sign(
        { userId: user.id },
        String(process.env.JWT_SECRET),
        { expiresIn: '5d' }
      );

      await this.prismaInst.user.update({
        where: { id: user.id },
        data: { accessToken },
      });

      return res.status(200).send({
        data: { email: user.email, role: user.role },
        accessToken,
      });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  signOut = async (req: CustomRequest, res: Response) => {
    try {
      const uid = req.user?.id || null;
      if (!uid) return res.status(400).send({ message: 'Missing param: id' });
      await this.prismaInst.user.update({
        where: { id: uid },
        data: { accessToken: '' },
      });

      return res.status(200).send({ message: 'AccessToken was destroyed' });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  getUserLikes = async (req: Request, res: Response) => {
    try {
      const { uid } = req.params;
      if (!uid)
        return res.status(400).send({ message: 'Missing param: userId' });

      const userLikes = await this.prismaInst.like.findMany({
        where: { userId: Number(uid) },
        include: { product: true },
      });
      return res.status(200).send({ data: userLikes });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  userLikesProduct = async (req: Request, res: Response) => {
    try {
      const { uid, pid } = req.params;
      if (!uid || !pid)
        return res
          .status(400)
          .send({ message: 'Missing param: userId, productId' });

      const isLiked = await this.prismaInst.like.findFirst({
        where: { userId: Number(uid), productId: Number(pid) },
      });

      if (isLiked) {
        await this.prismaInst.like.delete({ where: { id: isLiked.id } });
        return res
          .status(200)
          .send({ message: 'Product unliked', like: false });
      } else {
        await this.prismaInst.like.create({
          data: { userId: Number(uid), productId: Number(pid) },
        });
        return res.status(200).send({ message: 'Product liked', like: true });
      }
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  getUserOrders = async (req: Request, res: Response) => { };
  getUserCart = async (req: Request, res: Response) => { };
}

const userController = new UserController();
export default userController;
