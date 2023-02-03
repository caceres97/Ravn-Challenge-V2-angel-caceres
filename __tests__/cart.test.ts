import { Response } from 'express';
import { CustomRequest } from "../src/models/extras.model";
import { PrismaClient } from '@prisma/client';
import cartController from "../src/controllers/cart.controller"

// jest.mock('@prisma/client');

describe('CartController', () => {
    let req: CustomRequest;
    let res: Response;

    beforeEach(() => {
        req = {
            user: { id: 1 },
            params: { pid: 1 },
            body: { add: 1 }
        } as unknown as CustomRequest;
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnValue({})
        } as unknown as Response;
    });

    describe('getCart', () => {
        it('should return 400 if uid is not provided', async () => {
            req.user = undefined;
            await cartController.getCart(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({ message: 'Missing param: id' });
        });

        it('should return the cart for the given user', async () => {
            await cartController.getCart(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    })
})