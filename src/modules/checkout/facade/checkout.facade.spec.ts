import { Sequelize } from "sequelize-typescript"
import OrderModel from "../repository/order.model"
import OrderItemModel from "../repository/order-item.model"
import { ClientModel } from "../../client-adm/repository/client.model"
import ProductModel from "../../store-catalog/repository/product.model"
import CheckoutFacade from "./checkout.facade"
import CheckoutGateway from "../gateway/checkout.gateway"
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase"

const MockGateway = (): PlaceOrderUseCase => {
  // @ts-ignore
  return {
    execute: jest.fn().mockReturnValue({
      id: "1",
      invoiceId: "1234567890",
      total: 100
    })
  }
}

describe("Checkout Facade test", () => {
  // let sequelize: Sequelize

  // beforeEach(async () => {
  //   sequelize = new Sequelize({
  //     dialect: 'sqlite',
  //     storage: ':memory:',
  //     logging: false,
  //     sync: { force: true }
  //   })

  //   sequelize.addModels([OrderModel, OrderItemModel, ClientModel, ProductModel])
  //   await sequelize.sync()
  // })

  // afterEach(async () => {
  //   await sequelize.close()
  // })

  it("should create a order", async () => {
    const gateway = MockGateway()
    const facade = new CheckoutFacade(gateway)

    await facade.placeOrder({
      clientId: "1",
      products: [
        {
          productId: "1",
          salesPrice: 10
        }
      ]
    })

    expect(gateway.execute).toHaveBeenCalled()
  })
})