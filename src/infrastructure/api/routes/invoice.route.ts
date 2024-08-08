import express, { Request, Response } from 'express';
import FindInvoiceUsecase from '../../../modules/invoice/usecase/find-invoice/find-invoice.usecase';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';

export const invoicesRoute = express.Router();

invoicesRoute.get("/invoices/:id", async (req: Request, res: Response) => {
    try {
        const findInvoiceUseCase = new FindInvoiceUsecase(new InvoiceRepository())
        const invoiceId = {
            id: req.params.id
        };
        const invoice = await findInvoiceUseCase.execute(invoiceId);
        res.status(200).send(invoice);
    } catch(error) {
        res.status(500).send(error);
    }
});