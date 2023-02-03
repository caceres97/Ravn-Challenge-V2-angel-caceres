import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';

class OrderRoutes {
  public router: Router = Router();

  constructor() {
    this.getOrder();
    this.getOrders();
    this.createOrder();
  }

  public getOrder = () => {
    this.router.get(
      '/:oid',
      verifyToken,
      verifyRole('readOwn', 'orders'),
      orderController.gerOrder
    );
  };
  
  public getOrders = () => {
    this.router.get(
      '/',
      verifyToken,
      verifyRole('read', 'orders'),
      orderController.gerOrders
    );
  };

  public createOrder = () => {
    this.router.post(
      '/',
      verifyToken,
      verifyRole('create', 'orders'),
      orderController.createOrder
    );
  };
}

const orderRoutes = new OrderRoutes();
export default orderRoutes.router;
