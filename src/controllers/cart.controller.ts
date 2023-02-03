import { Request, Response } from 'express';
import { CustomRequest } from '../models/extras.model';
import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

@Service()
class CartController {
    public prismaInst: PrismaClient;

    constructor() {
        this.prismaInst = new PrismaClient();
    }

    getCart = async (req: CustomRequest, res: Response) => {
        const uid = req.user?.id || null;
        if (!uid) return res.status(400).send({ message: 'Missing param: id' });

        const cart = await this.prismaInst.cart.findMany({
            where: { userId: Number(uid) },
            // select: { id: true, quantity: true, product: true },
            include: { product: true }
        });
        return res.status(200).send({ data: cart });

    }

    addToCart = async (req: CustomRequest, res: Response) => {
        try {
            const { pid } = req.params;
            const add = req.body?.add || 1;
            const uid = req.user?.id || null;

            if (!uid || !pid)
                return res
                    .status(400)
                    .send({ message: 'Missing param: id, productId' });

            const cartExist = await this.prismaInst.cart.findFirst({
                where: { userId: Number(uid), productId: Number(pid) },
            });

            if (cartExist) {
                const addProduct = await this.prismaInst.cart.update({
                    where: { id: cartExist.id },
                    data: {
                        productId: Number(pid),
                        userId: uid,
                        quantity: cartExist.quantity + add,
                    },
                });
                return res
                    .status(200)
                    .send({ message: `Adding +${add}`, data: addProduct });
            } else {
                const addProduct = await this.prismaInst.cart.create({
                    data: {
                        productId: Number(pid),
                        userId: uid,
                    },
                });
                return res
                    .status(200)
                    .send({ message: 'Product added', data: addProduct });
            }
        } catch (error) {
            return res.status(500).send({ error });
        }
    };

    deleteFromCart = async (req: CustomRequest, res: Response) => {
        try {
            const { pid } = req.params;
            const uid = req.user?.id || null;
            if (!uid || !pid)
                return res
                    .status(400)
                    .send({ message: 'Missing param: id, productId˝' });
            const productInCart = await this.prismaInst.cart.findFirst({
                where: { productId: Number(pid), userId: Number(uid) },
            });

            const deletingCart = await this.prismaInst.cart.delete({
                where: { id: productInCart?.id },
            });

            return res
                .status(200)
                .send({ message: 'product deleted from cart', data: deletingCart });
        } catch (error) {
            return res.status(500).send({ error });
        }
    };
}

const cartController = new CartController();
export default cartController;
