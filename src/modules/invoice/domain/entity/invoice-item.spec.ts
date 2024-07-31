import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "./invoice-item"

const item = {
    id: new Id('1'),
    name: "Macbook",
    price: 15000
}

describe("Create invoice item", () => {
    it("should create new invoice item", () => {
        const invoiceItem = new InvoiceItem(item);

        expect(invoiceItem.id.id).toBe(item.id.id);
        expect(invoiceItem.name).toBe(item.name);
        expect(invoiceItem.price).toBe(item.price);
    })

    it("should throw error when name is empty", () => {
        item.name = "";

        expect(() =>  {
            new InvoiceItem(item);
        }).toThrow("Name is required");
    })

    it("should throw error when price is less than or equal to zero", () => {
        item.name = "Joãozinho";
        item.price = 0;

        expect(() =>  {
            new InvoiceItem(item);
        }).toThrow("Price must be greater than 0");
    })
})