import { Request, Response } from 'express';
import { CustomRequest } from '../models/extras.model';
import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

@Service()
class OrderController {
    private prismaInst: PrismaClient;

    constructor() {
        this.prismaInst = new PrismaClient();
    }

    gerOrder = async (req: Request, res: Response) => {
        try {
            const { oid } = req.params
            if (!oid) return res.status(400).send({ message: 'Missing param: id' });

            const order = await this.prismaInst.order.findFirst({ where: { id: Number(oid) }, include: { Order_Detail: { include: { product: true } } } });
            return res.status(200).send({ data: order });
        } catch (error) {
            return res.status(500).send({ error });
        }
    };

    gerOrders = async (req: Request, res: Response) => {
        try {
            const orders = await this.prismaInst.order.findMany({ include: { Order_Detail: { include: { product: true } } } });
            return res.status(200).send({ data: orders });
        } catch (error) {
            return res.status(500).send({ error });
        }
    };

    getUserOrders = async (req: CustomRequest, res: Response) => {
        try {
            const uid = req.user?.id || null;
            if (!uid) return res.status(400).send({ message: 'Missing param: id' });

            const orders = await this.prismaInst.order.findMany({ where: { userId: uid }, include: { Order_Detail: { include: { product: true } } } });
            return res.status(200).send({ data: orders });
        } catch (error) {
            return res.status(500).send({ error });

        }
    };

    createOrder = async (req: CustomRequest, res: Response) => {
        const uid = req.user?.id || null;
        if (!uid) return res.status(400).send({ message: 'Missing param: id' });

        const getCart = await this.prismaInst.cart.findMany({ where: { userId: uid }, include: { product: true } });

        if (!getCart) return res.status(404).send({ message: 'Add products in yoyr cart to create an order' });

        //Prepare the insertion
        let total = 0
        const stockChange: any = [];
        const orderDetail = getCart.map((cart: any) => {
            const quantity = cart.quantity;
            const productId = cart.productId;
            const newStock = cart.product.stock - quantity;

            // if (newStock < 0) { return res.status(400).send({ message: `Product: ${cart.product.name} hasn't enogth stock` }) };

            const totalPerProduct = Number(cart.product.price) * Number(quantity);
            total += totalPerProduct;
            stockChange.push(this.prismaInst.product.update({ where: { id: productId }, data: { stock: newStock } }));

            return { productId, quantity }
        });
        //After the insertion I need to
        const createOrder = this.prismaInst.order.create({
            data: {
                userId: uid,
                total,
                Order_Detail: { create: orderDetail }
            }
        });

        const trans = await this.prismaInst.$transaction([createOrder, ...stockChange]);

        res.send({ data: trans });
    };
}

const orderController = new OrderController();
export default orderController;
