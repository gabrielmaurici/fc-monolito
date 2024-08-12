import express, { Request, Response } from 'express'
import AddClientUseCase from '../../../modules/client-adm/usecase/add-client/add-client.usecase';
import ClientRepository from '../../../modules/client-adm/repository/client.repository';

export const clientsRoute = express.Router();

clientsRoute.post("/", async (req: Request, res: Response) => {
    try {
        const addClientUseCase = new AddClientUseCase(new ClientRepository());
        const clientDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: req.body.address,
        };
        const client = await addClientUseCase.execute(clientDto);
    
        res.status(201).send(client);
    } catch(error) {
        res.status(500).send(error);
    }
});