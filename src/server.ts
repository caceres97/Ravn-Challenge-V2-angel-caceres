import express, { Application } from 'express';
import formData from 'express-form-data';
import morgan from 'morgan';
import cors from 'cors';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cart.routes';

class Server {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // this.app.use(formData.parse());
  }

  routes(): void {
    this.app.use('/users', userRoutes);
    this.app.use('/products', productRoutes);
    this.app.use('/orders', orderRoutes);
    this.app.use('/cart', cartRoutes);
    this.app.use('/images/', express.static(__dirname + '/images'));
  }

  start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server on port ' + this.app.get('port'));
    });
  }
}

const server = new Server();
server.start();
