import { Router } from 'express';
import productController from '../controllers/product.controller';
import { upload } from '../utils/helpers';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware';

class ProductRoutes {
  public router: Router = Router();

  constructor() {
    this.getProduct();
    this.getProducts();
    this.createProduct();
    this.updateProduct();
    this.deleteProduct();
    this.hideProduct();
    this.addStock();
  }

  public getProduct = () => {
    this.router.get('/:pid', productController.getProduct);
  };

  public getProducts = () => {
    this.router.get('/', verifyToken, productController.getProducts);
  };

  public createProduct = () => {
    this.router.post(
      '/',
      upload.array('images'),
      verifyToken,
      verifyRole('create', 'products'),
      productController.createProduct
    );
  };

  public updateProduct = () => {
    this.router.put(
      '/:pid',
      verifyToken,
      verifyRole('update', 'products'),
      productController.updateProduct
    );
  };

  public deleteProduct = () => {
    this.router.delete(
      '/:pid',
      verifyToken,
      verifyRole('delete', 'products'),
      productController.deleteProduct
    );
  };

  public hideProduct = () => {
    this.router.patch(
      '/:pid',
      verifyToken,
      verifyRole('update', 'products'),
      productController.hideProduct
    );
  };

  public addStock = () => {
    this.router.patch(
      '/:pid/stock',
      verifyToken,
      verifyRole('update', 'products'),
      productController.addStock
    );
  };
}

const productRoutes = new ProductRoutes();
export default productRoutes.router;
