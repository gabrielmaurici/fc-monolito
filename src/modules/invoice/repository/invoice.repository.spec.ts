import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemModel } from "./invoice-item.model"
import Invoice from "../domain/entity/invoice"
import InvoiceItem from "../domain/entity/invoice-item"
import InvoiceRepository from "./invoice.repository"

describe("Invoice Repository test", () => {
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

  it("should create a invoice", async () => {

    const invoice = new Invoice({
      id: new Id("1"),
      name: "Lucian",
      document: "1234-5678",
      address: new Address(
        "Rua 123",
        "99",
        "Casa Verde",
        "Criciúma",
        "SC",
        "88888-888"
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Macbook",
          price: 15000
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Iphone",
          price: 8000
        })
      ]
    })

    const repository = new InvoiceRepository()
    await repository.add(invoice)

    const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: [InvoiceItemModel] })
    
    expect(invoiceDb).toBeDefined()
    expect(invoiceDb.id).toEqual(invoice.id.id)
    expect(invoiceDb.name).toEqual(invoice.name)
    expect(invoiceDb.document).toEqual(invoice.document)
    expect(invoiceDb.street).toEqual(invoice.address.street)
    expect(invoiceDb.number).toEqual(invoice.address.number)
    expect(invoiceDb.complement).toEqual(invoice.address.complement)
    expect(invoiceDb.city).toEqual(invoice.address.city)
    expect(invoiceDb.state).toEqual(invoice.address.state)
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode)
    expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt)
    expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt)
    expect(invoiceDb.items[0].id).toStrictEqual(invoice.items[0].id.id)
    expect(invoiceDb.items[0].name).toStrictEqual(invoice.items[0].name)
    expect(invoiceDb.items[0].price).toStrictEqual(invoice.items[0].price)
    expect(invoiceDb.items[1].id).toStrictEqual(invoice.items[1].id.id)
    expect(invoiceDb.items[1].name).toStrictEqual(invoice.items[1].name)
    expect(invoiceDb.items[1].price).toStrictEqual(invoice.items[1].price)
  })

  it("should find a invoice", async () => {

    const invoice = await InvoiceModel.create({
      id: '1',
      name: 'Lucian',
      document: "1234-5678",
      street: "Rua 123",
      number: "99",
      complement: "Casa Verde",
      city: "Criciúma",
      state: "SC",
      zipCode: "88888-888",      
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        new InvoiceItemModel({
          id: "1",
          name: "Macbook",
          price: 15000,
          invoiceid: '1'
        })
        ,
        new InvoiceItemModel({
          id: "2",
          name: "Iphone",
          price: 8000,
          invoiceId: '1'
        })
      ]
    }, {
      include: [InvoiceItemModel]
    })

    const repository = new InvoiceRepository()
    const result = await repository.find(invoice.id)

    expect(result.id.id).toEqual(invoice.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.address.street).toEqual(invoice.street)
    expect(result.address.number).toEqual(invoice.number)
    expect(result.address.complement).toEqual(invoice.complement)
    expect(result.address.city).toEqual(invoice.city)
    expect(result.address.state).toEqual(invoice.state)
    expect(result.address.zipCode).toEqual(invoice.zipCode)
    expect(result.createdAt).toStrictEqual(invoice.createdAt)
    expect(result.updatedAt).toStrictEqual(invoice.updatedAt)
    expect(result.items[0].id.id).toStrictEqual(invoice.items[0].id)
    expect(result.items[0].name).toStrictEqual(invoice.items[0].name)
    expect(result.items[0].price).toStrictEqual(invoice.items[0].price)
    expect(result.items[1].id.id).toStrictEqual(invoice.items[1].id)
    expect(result.items[1].name).toStrictEqual(invoice.items[1].name)
    expect(result.items[1].price).toStrictEqual(invoice.items[1].price)
  })
})