import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';

class CartRoutes {
  public router: Router = Router();

  constructor() {
    this.addToCart();
    this.deleteFromCart();
  }

  public addToCart = () => {
    this.router.post(
      '/:pid/products',
      verifyToken,
      verifyRole('create', 'cart'),
      cartController.addToCart
    );
  };

  public deleteFromCart = () => {
    this.router.delete(
      '/:pid/products',
      verifyToken,
      verifyRole('update', 'cart'),
      cartController.deleteFromCart
    );
  };
}

const cartRoutes = new CartRoutes();
export default cartRoutes.router;
