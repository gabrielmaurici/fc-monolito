import request from "supertest";
import { app } from "../api/express"
import { Sequelize } from "sequelize-typescript";
import { migrator } from "../../db/config-migrations/migrator";
import { Umzug } from "umzug";
import { initializeDatabase } from "../../db/database.init";

describe("Client API e2e test", () => {
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

    it("should create a client", async () => {
        const client = {
            name: "Joãozinho",
            email: "joaozinho@hotmail.com",
            document: "999.999.999-99",
            address: {
                street: "Street test",
                number: "11",
                complement: "Complement test",
                city: "City test",
                state: "State test",
                zipCode: "12341235",
            },
        };

        const response = await request(app).post("/clients").send(client);
        console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.name).toEqual(client.name);
        expect(response.body.document).toEqual(client.document);
        expect(response.body.email).toEqual(client.email);
        expect(response.body.name).toEqual(client.name);
        expect(response.body.address._street).toEqual(client.address.street);
        expect(response.body.address._number).toEqual(client.address.number);
        expect(response.body.address._complement).toEqual(client.address.complement);
        expect(response.body.address._city).toEqual(client.address.city);
        expect(response.body.address._state).toEqual(client.address.state);
        expect(response.body.address._zipCode).toEqual(client.address.zipCode);
    });
});