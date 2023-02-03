import { AccessControl } from 'accesscontrol';
import { Roles } from './models/user.model';

class SystemRoles {
  public ac: AccessControl = new AccessControl();
  constructor() {
    this.ac = new AccessControl();
    this.asignRoles();
  }

  asignRoles = () => {
    this.ac
      .grant(Roles.manager)
      .create('products')
      //Add Stock and hide product
      .update('products')
      .delete('products')
      .read('orders');

    this.ac
      .grant(Roles.client)
      .readOwn('orders')
      .create('orders')
      .readOwn('cart')
      .create('cart')
      .update('cart')
      .read('likes')
      .update('likes');
  };
}

const systemRoles = new SystemRoles();
export default systemRoles.ac;
