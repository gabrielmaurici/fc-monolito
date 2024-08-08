import express, { Request, Response } from 'express';
import AddProductUseCase from '../../../modules/product-adm/usecase/add-product/add-product.usecase';
import ProductRepository from '../../../modules/product-adm/repository/product.repository';

export const productsRoute = express.Router();

productsRoute.post("/products", async (req: Request, res: Response) => {
    try {
        const addProductUseCase = new AddProductUseCase(new ProductRepository())
        const productDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        };
        const product = await addProductUseCase.execute(productDto);
        res.status(201).send(product);
    } catch(error) {
        res.status(500).send(error);
    }
});