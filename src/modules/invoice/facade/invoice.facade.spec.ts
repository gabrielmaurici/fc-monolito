import { Sequelize } from "sequelize-typescript"
import { InvoiceModel } from "../repository/invoice.model"
import { InvoiceItemModel } from "../repository/invoice-item.model"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe("Invoice Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it("should create a Invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input = {
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Macbook",
          price: 15000
        },
        {
          id: "2",
          name: "Iphone",
          price: 8000
        }
      ]
    }

    await facade.add(input)

    const invoice = await InvoiceModel.findOne({ include: [InvoiceItemModel] })

    expect(invoice).toBeDefined()
    expect(invoice.name).toEqual(input.name)
    expect(invoice.street).toEqual(input.street)
    expect(invoice.number).toEqual(input.number)
    expect(invoice.complement).toEqual(input.complement)
    expect(invoice.city).toEqual(input.city)
    expect(invoice.state).toEqual(input.state)
    expect(invoice.zipCode).toEqual(input.zipCode)
    expect(invoice.items[0].id).toStrictEqual(input.items[0].id)
    expect(invoice.items[0].name).toStrictEqual(input.items[0].name)
    expect(invoice.items[0].price).toStrictEqual(input.items[0].price)
    expect(invoice.items[1].id).toStrictEqual(input.items[1].id)
    expect(invoice.items[1].name).toStrictEqual(input.items[1].name)
    expect(invoice.items[1].price).toStrictEqual(input.items[1].price)
  })

  it("should find a client", async () => {
    const facade = InvoiceFacadeFactory.create()
    const input = {
      id: "1",
      name: "Lucian",
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",
      items: [
        {
          id: "1",
          name: "Macbook",
          price: 15000
        },
        {
          id: "2",
          name: "Iphone",
          price: 8000
        }
      ]
    };

    await facade.add(input);

    const invoice = await facade.find({ id: "1" });

    expect(invoice).toBeDefined()
    expect(invoice.id).toEqual(input.id)
    expect(invoice.name).toEqual(input.name)
    expect(invoice.address.street).toEqual(input.street)
    expect(invoice.address.number).toEqual(input.number)
    expect(invoice.address.complement).toEqual(input.complement)
    expect(invoice.address.city).toEqual(input.city)
    expect(invoice.address.state).toEqual(input.state)
    expect(invoice.address.zipCode).toEqual(input.zipCode)
    expect(invoice.items[0].id).toStrictEqual(input.items[0].id)
    expect(invoice.items[0].name).toStrictEqual(input.items[0].name)
    expect(invoice.items[0].price).toStrictEqual(input.items[0].price)
    expect(invoice.items[1].id).toStrictEqual(input.items[1].id)
    expect(invoice.items[1].name).toStrictEqual(input.items[1].name)
    expect(invoice.items[1].price).toStrictEqual(input.items[1].price)
  })
})