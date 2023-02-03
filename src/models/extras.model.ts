import { Request } from 'express';

interface CustomRequest extends Request {
  user?: { id: number; role: string };
}

export { CustomRequest };
