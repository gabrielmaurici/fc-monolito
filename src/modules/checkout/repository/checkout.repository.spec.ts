import { Sequelize } from "sequelize-typescript"
import OrderModel from "./order.model"
import OrderItemModel from "./order-item.model"
import { ClientModel } from "../../client-adm/repository/client.model"
import ProductModel from "../../store-catalog/repository/product.model"
import Address from "../../@shared/domain/value-object/address"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Product from "../domain/product.entity"
import CheckoutRepository from "./checkout.repository"
import Order from "../domain/order.entity"

describe("Checkout Repository", () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([OrderModel, OrderItemModel, ClientModel, ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should place an order", async () => {

    const address = new Address("Street", "1", "Complement", "City", "State", "ZipCode")
    const client = new Client({
      name: "Client",
      email: "Email",
      address: address
    })

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: "client.document",
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipcode: client.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const product1 = new Product({
      id: new Id("pid1"),
      name: "Product 1",
      description: "Description",
      salesPrice: 100
    })

    const product2 = new Product({
      id: new Id("pid2"),
      name: "Product 2",
      description: "Description",
      salesPrice: 200
    })

    await ProductModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await ProductModel.create({
      id: product2.id.id,
      name: product2.name,
      description: product2.description,
      salesPrice: product2.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const order = new Order({
      id: new Id("1"),
      client: client,
      products: [product1, product2]
    })
    const repository = new CheckoutRepository()
    await repository.addOrder(order)


    const orderModel = await OrderModel.findOne({
      where: { id: order.id.id },
      include: ["items", "client"]
    })


    expect(orderModel.id).toBe(order.id.id)
    expect(orderModel.client.id).toBe(client.id.id)

    expect(orderModel.items.length).toBe(2)
    expect(orderModel.items[0].productId).toBe(product1.id.id)
    expect(orderModel.items[0].price).toBe(product1.salesPrice)
    expect(orderModel.items[1].productId).toBe(product2.id.id)
    expect(orderModel.items[1].price).toBe(product2.salesPrice)
  })

  it("should find an order", async () => {
    const address = new Address("Street", "1", "Complement", "City", "State", "ZipCode")
    const client = new Client({
      name: "Client",
      email: "Email",
      address: address
    })

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: "client.document",
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipcode: client.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const product1 = new Product({
      id: new Id("pid1"),
      name: "Product 1",
      description: "Description",
      salesPrice: 100
    })

    await ProductModel.create({
      id: product1.id.id,
      name: product1.name,
      description: product1.description,
      salesPrice: product1.salesPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    const order = new Order({
      id: new Id("1"),
      client: client,
      products: [product1]
    })
    
    await OrderModel.create({
      id: order.id.id,
      clientId: order.client.id.id,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    await OrderItemModel.create({
      orderId: order.id.id,
      productId: product1.id.id,
      price: 100,
    })
    
    const repository = new CheckoutRepository()
    const result = await repository.findOrder(order.id.id)

    expect(result.id.id).toBe(order.id.id)
    expect(result.client.id.id).toBe(order.client.id.id)
    expect(result.products.length).toBe(1)
    expect(result.products[0].id.id).toBe(order.products[0].id.id)
    expect(result.products[0].name).toBe("Product 1")
    expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice)
  })
})