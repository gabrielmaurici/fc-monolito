import express, { Request, Response } from 'express';
import CheckoutFacadeFactory from '../../../modules/checkout/factory/checkout.facade.factory';
import PlaceOrderUseCase from '../../../modules/checkout/usecase/place-order/place-order.usecase';
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../../modules/store-catalog/factory/facade.factory';
import CheckoutRepository from '../../../modules/checkout/repository/checkout.repository';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory';

export const checkoutsRoute = express.Router();

checkoutsRoute.post("/checkouts", async (req: Request, res: Response) => {
    try {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();
        const storeCatalogFacade = StoreCatalogFacadeFactory.create();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const checkoutRepository = new CheckoutRepository();

        const addCheckoutUseCase = new PlaceOrderUseCase(
            clientFacade,
            productFacade,
            storeCatalogFacade,
            checkoutRepository,
            invoiceFacade
        );
        const checkoutDto = {
            clientId: req.body.clientId,
            products: req.body.products
        };
        const checkout = await addCheckoutUseCase.execute(checkoutDto);
        res.status(201).send(checkout);
    } catch(error) {
        res.status(500).send(error);
    }
});