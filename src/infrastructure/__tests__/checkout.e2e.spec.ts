import request from "supertest";
import { app } from "../api/express"
import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../db/config-migrations/migrator";
import { Umzug } from "umzug";
import { initializeDatabase } from "../../db/database.init";
import ProductAdmFacadeFactory from "../../modules/product-adm/factory/facade.factory";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";
import Address from "../../modules/@shared/domain/value-object/address";


describe("Checkoeut API e2e test", () => {
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

    it("should create a checkout", async () => {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();

        const clientDto = {
            id: "1",
            name: "Joãozinho",
            email: "joaozinho@hotmail.com",
            document: "999.999.999-99",
            address: new Address(
                "Street test",
                "11",
                "Complement test",
                "City test",
                "State test",
                "12341235",
            )
        }
        await clientFacade.add(clientDto);

        const productDto = {
            id: "1",
            name: "Macbook",
            description: "Notbook",
            purchasePrice: 15000,
            stock: 10
        };
        await productFacade.addProduct(productDto);

        const checkout = {
            clientId: clientDto.id,
            products: [{
                productId: productDto.id,
                salesPrice: productDto.purchasePrice
            }]
        };
        
        const response = await request(app).post("/checkout").send(checkout);
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.total).toEqual(15000);
        expect(response.body.products[0].productId).toEqual(productDto.id);
        expect(response.body.products[0].salesPrice).toEqual(productDto.purchasePrice);
    });
});