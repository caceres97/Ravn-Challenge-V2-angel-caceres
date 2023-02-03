import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import userController from '../controllers/user.controller';
import orderController from '../controllers/order.controller';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';

class UserRoutes {
  public router: Router = Router();

  constructor() {
    this.signIn();
    this.signUp();
    this.signOut();
    this.getUserLikes();
    this.userLikesProduct();
    this.getUserOrders();
    this.getUserCart();
  }

  public signIn = () => {
    this.router.post('/signin', userController.signIn);
  };

  public signUp = () => {
    this.router.post('/signup', userController.signUp);
  };

  public signOut = () => {
    this.router.post('/signout', verifyToken, userController.signOut);
  };

  //Users likes
  public getUserLikes = () => {
    this.router.get('/:uid/likes', verifyToken,
      verifyRole('read', 'likes'), userController.getUserLikes);
  };

  public userLikesProduct = () => {
    this.router.post('/:uid/likes/:pid', verifyToken,
      verifyRole('update', 'likes'), userController.userLikesProduct);
  };

  //Get User Orders
  public getUserOrders = () => {
    this.router.get('/orders', verifyToken,
      verifyRole('readOwn', 'orders'), orderController.getUserOrders);
  };

  //Get Cart
  public getUserCart = () => {
    this.router.get('/cart', verifyToken,
      verifyRole('readOwn', 'cart'), cartController.getCart);
  };
}

const userRoutes = new UserRoutes();
export default userRoutes.router;
