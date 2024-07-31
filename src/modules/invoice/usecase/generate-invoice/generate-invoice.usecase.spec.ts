import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn()
  }
}

describe("Generate invoice use case unit test", () => {

  it("should generate a invoice", async () => {

    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
      name: "Invoice test",
      document: "123",
      street: "street test",
      number: "123",
      complement: "house",
      city: "city test",
      state: "state test",
      zipCode: "123523",
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

    const result = await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.street).toEqual(input.street)
    expect(result.number).toEqual(input.number)
    expect(result.complement).toEqual(input.complement)
    expect(result.city).toEqual(input.city)
    expect(result.state).toEqual(input.state)
    expect(result.zipCode).toEqual(input.zipCode)
  })
})