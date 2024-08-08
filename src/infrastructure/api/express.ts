import express, { type Express } from "express";
import { checkoutsRoute } from "./routes/checkouts.route";
import { clientsRoute } from "./routes/clients.route"
import { productsRoute } from "./routes/products.route";
import { invoicesRoute } from "./routes/invoice.route";
import { Sequelize } from "sequelize-typescript";
import OrderModel from "../../modules/checkout/repository/order.model";
import { ProductModel as AdmProductModel} from "../../modules/product-adm/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import TransactionModel from "../../modules/payment/repository/transaction.model"
import ProductModel  from "../../modules/store-catalog/repository/product.model"
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import OrderItemModel from "../../modules/checkout/repository/order-item.model";

export const app: Express = express();
app.use(express.json());
app.use("/products", productsRoute);
app.use("/clients", clientsRoute);
app.use("/checkouts", checkoutsRoute);
app.use("/invoices", invoicesRoute);

export let sequelize: Sequelize;

(async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([
    OrderModel,
    AdmProductModel,
    ClientModel,
    TransactionModel,
    ProductModel,
    InvoiceItemModel,
    InvoiceModel,
    OrderModel,
    OrderItemModel
  ]);
  await sequelize.sync();
})().catch((err) => {
  console.error(err);
});