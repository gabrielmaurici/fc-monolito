import { Sequelize } from "sequelize-typescript";
import { migrator } from "./config-migrations/migrator";
import { ProductRegistrationModel } from "../modules/product-adm/repository/product-registration.model";
import ProductModel from "../modules/store-catalog/repository/product.model";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import { InvoiceItemModel } from "../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../modules/invoice/repository/invoice.model";
import OrderModel from "../modules/checkout/repository/order.model";
import OrderItemModel from "../modules/checkout/repository/order-item.model";

export async function initializeDatabase(): Promise<Sequelize> {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
    });

    const migration = migrator(sequelize);
    await migration.up();

    sequelize.addModels([
        ProductRegistrationModel,
        ProductModel,
        ClientModel,
        TransactionModel,
        InvoiceItemModel,
        InvoiceModel,
        OrderModel,
        OrderItemModel
    ]);
    await sequelize.sync();
    
    return sequelize;
}