import request from "supertest";
import { app } from "../api/express"
import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../db/config-migrations/migrator";
import { Umzug } from "umzug";
import { initializeDatabase } from "../../db/database.init";

describe("Product API e2e test", () => {
    let sequelize: Sequelize
    let migration: Umzug<any>;

    beforeEach(async () => {
        await initializeDatabase();
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