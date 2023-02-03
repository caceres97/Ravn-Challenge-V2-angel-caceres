import { Request, Response } from 'express';
import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';
import { Category } from '../models/product.models';
import _ from 'lodash';

@Service()
class ProductController {
  private prismaInst: PrismaClient;

  constructor() {
    this.prismaInst = new PrismaClient();
  }

  getProduct = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;
      if (!pid) return res.status(400).send({ message: 'Missing param: id' });
      const product = await this.prismaInst.product.findFirst({
        where: { id: Number(pid), deleted: false },
        select: {
          id: true,
          name: true,
          remark: true,
          category: true,
          stock: true,
          Product_Image: { select: { url: true } },
        },
      });

      if (!product)
        return res.status(404).send({ message: 'Product not exist', data: {} });

      return res.status(200).send({ data: product });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  getProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.prismaInst.product.findMany({
        where: { active: true, deleted: false },
        select: {
          id: true,
          name: true,
          remark: true,
          category: true,
          stock: true,
          Product_Image: { select: { url: true } },
        },
      });

      if (!products) return res.status(404).send({ message: 'Product not exist', data: {} });

      return res.status(200).send({ data: products });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  createProduct = async (req: Request, res: Response) => {
    try {
      const { name, remark, category, stock } = req.body;
      let images = [];
      if (req.files) {
        const files: any = req.files;
        images = files.map((file: any) => {
          return { url: file.location };
        });
      }

      if (!name || !remark || !category)
        return res
          .status(400)
          .send({ message: 'Missing params: name, remark, category' });

      const newProduct = await this.prismaInst.product.create({
        data: {
          name,
          remark,
          category,
          stock: stock || 10,
          active: true,
          deleted: false,
          Product_Image: { create: images },
        },
      });

      return res.status(200).send({ data: newProduct });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  updateProduct = async (req: Request, res: Response) => {
    try {
      const { name, remark, category } = req.body;
      const { pid } = req.params;
      const dataToUpdate: {
        name?: string;
        remark?: string;
        category?: Category;
      } = {};

      if (name) dataToUpdate.name = name;
      if (remark) dataToUpdate.name = remark;
      if (category) dataToUpdate.category = category;
      if (_.isEmpty(dataToUpdate) || !pid)
        return res.status(400).send({
          message: 'Only name, remark and category are available to update',
        });

      const updatedProduct = await this.prismaInst.product.update({
        where: { id: Number(pid) },
        data: dataToUpdate,
      });

      return res.status(200).send({ data: updatedProduct });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  deleteProduct = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;
      if (!pid) return res.status(400).send({ message: 'Missing param: id' });
      const deletedProduct = await this.prismaInst.product.update({
        where: { id: Number(pid) },
        data: { active: false, deleted: true },
      });

      return res.status(200).send({ data: deletedProduct });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  hideProduct = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;
      if (!pid) return res.status(400).send({ message: 'Missing param: id' });
      const hiddenProduct = await this.prismaInst.product.update({
        where: { id: Number(pid) },
        data: { active: false },
      });

      return res.status(200).send({ data: hiddenProduct });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };

  addStock = async (req: Request, res: Response) => {
    try {
      const { pid } = req.params;
      const { stock } = req.body;
      if (!pid || !stock)
        return res.status(400).send({ message: 'Missing param: id or stock' });
      const currectStock = await this.prismaInst.product.findFirst({
        where: { id: Number(pid) },
        select: { stock: true },
      });
      const newStock = Number(stock) + Number(currectStock?.stock || 0);
      const addStock = await this.prismaInst.product.update({
        where: { id: Number(pid) },
        data: { stock: newStock },
      });

      return res.status(200).send({ data: addStock });
    } catch (error) {
      return res.status(500).send({ error });
    }
  };
}

const productController = new ProductController();
export default productController;
