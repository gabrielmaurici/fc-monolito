import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import Invoice from "../../domain/entity/invoice"
import InvoiceItem from "../../domain/entity/invoice-item"
import FindInvoiceUsecase from "./find-invoice.usecase"

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice test",
  document: "123",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888",
  ),
  items: [
    new InvoiceItem({
      id: new Id("1"),
      name: "Macbook",
      price: 15000
    })
    ,
    new InvoiceItem({
      id: new Id("2"),
      name: "Iphone",
      price: 8000
    })
  ]
})

const MockRepository = () => {

  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find Invoice use case unit test", () => {

  it("should find a invoice", async () => {

    const repository = MockRepository()
    const usecase = new FindInvoiceUsecase(repository)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.city).toEqual(invoice.address.city)
    expect(result.address.complement).toEqual(invoice.address.complement)
    expect(result.address.number).toEqual(invoice.address.number)
    expect(result.address.state).toEqual(invoice.address.state)
    expect(result.address.street).toEqual(invoice.address.street)
    expect(result.address.zipCode).toEqual(invoice.address.zipCode)
    expect(result.createdAt).toEqual(invoice.createdAt)
    expect(result.items[0].id).toEqual(invoice.items[0].id.id)
    expect(result.items[0].name).toEqual(invoice.items[0].name)
    expect(result.items[0].price).toEqual(invoice.items[0].price)
    expect(result.items[1].id).toEqual(invoice.items[1].id.id)
    expect(result.items[1].name).toEqual(invoice.items[1].name)
    expect(result.items[1].price).toEqual(invoice.items[1].price)
    expect(result.total).toEqual(23000)
    expect(result.createdAt).toEqual(invoice.createdAt)
  })
})