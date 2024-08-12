import request from "supertest";
import { app } from "../api/express"
import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../db/config-migrations/migrator";
import { Umzug } from "umzug";
import { initializeDatabase } from "../../db/database.init";
import GenerateInvoiceUseCase from "../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";

describe("Invoice API e2e test", () => {
    let sequelize: Sequelize
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = await initializeDatabase();
    });
    afterEach(async () => {
        if (!migration || !sequelize) {
            return 
          }
          migration = migrator(sequelize)
          await migration.down()
          await sequelize.close()
    });

    it("should find a invoice", async () => {
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(new InvoiceRepository());
        const invoiceGenerated = await generateInvoiceUseCase.execute({
            name: "Invoice test",
            document: "999.999.999-99",
            street: "Street test",
            number: "11",
            complement: "Complement test",
            city: "City test",
            state: "State test",
            zipCode: "123123",
            items: [
                {
                    id: "1",
                    name: "Macbook",
                    price: 15000,
                }
            ]
        });
        
        const response = await request(app).get(`/invoices/${invoiceGenerated.id}`).send();

        expect(response.status).toBe(200);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toEqual(invoiceGenerated.name);
        expect(response.body.document).toEqual(invoiceGenerated.document);
        expect(response.body.address.street).toEqual(invoiceGenerated.street);
        expect(response.body.address.number).toEqual(invoiceGenerated.number);
        expect(response.body.address.complement).toEqual(invoiceGenerated.complement);
        expect(response.body.address.city).toEqual(invoiceGenerated.city);
        expect(response.body.address.state).toEqual(invoiceGenerated.state);
        expect(response.body.address.zipCode).toEqual(invoiceGenerated.zipCode);
        expect(response.body.items[0].id).toEqual(invoiceGenerated.items[0].id);
        expect(response.body.items[0].name).toEqual(invoiceGenerated.items[0].name);
        expect(response.body.items[0].price).toEqual(invoiceGenerated.items[0].price);
        expect(response.body.total).toEqual(15000);
    });
});