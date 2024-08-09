import request from "supertest";
import { app } from "../api/express"
import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../db/config-migrations/migrator";
import OrderModel from "../../modules/checkout/repository/order.model";
import { ProductRegistrationModel } from "../../modules/product-adm/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import TransactionModel from "../../modules/payment/repository/transaction.model"
import ProductModel  from "../../modules/store-catalog/repository/product.model"
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import OrderItemModel from "../../modules/checkout/repository/order-item.model";
import { Umzug } from "umzug";

describe("Product API e2e test", () => {
    let sequelize: Sequelize
    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        });
        migration = migrator(sequelize);
        await migration.up();
        
        sequelize.addModels([
            ProductRegistrationModel,
            ClientModel,
            TransactionModel,
            ProductModel,
            InvoiceItemModel,
            InvoiceModel,
            OrderModel,
            OrderItemModel
        ]);
        await sequelize.sync();
    });
    afterEach(async () => {
        if (!migration || !sequelize) {
            return 
          }
          migration = migrator(sequelize)
          await migration.down()
          await sequelize.close()
    });

    it("should create a product", async () => {
        const product = {
            name: "Macbook",
            description: "Note Apple",
            purchasePrice: 15000,
            stock: 10,
        };

        const response = await request(app).post("/products").send(product);
        console.log(response.status)
        expect(response.status).toBe(201);
        expect(response.body).toEqual(
        expect.objectContaining({
            id: expect.any(String),
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
        })
        );
    });
});