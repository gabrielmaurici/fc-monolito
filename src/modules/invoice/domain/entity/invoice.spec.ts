import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "./invoice";
import InvoiceItem from "./invoice-item"

const address = new Address("1", "123", "complement test", "City test", "State test", "10239");

const invoiceItems = [
    new InvoiceItem({
        id: new Id('1'),
        name: "Macbook",
        price: 15000
    }),
    new InvoiceItem({
        id: new Id('2'),
        name: "Iphone",
        price: 8000
    }),
];

const invoiceProps = { 
    id: new Id('1'),
    name: "Invoice test",
    document: "123",
    address: address,
    items: invoiceItems
};


describe("Create invoice", () => {
    it("should create new invoice", () => {
        const invoice = new Invoice(invoiceProps);

        expect(invoice.items.length).toBe(invoiceProps.items.length);

        expect(invoice.id.id).toBe(invoiceProps.id.id);
        expect(invoice.name).toBe(invoiceProps.name);
        expect(invoice.document).toBe(invoiceProps.document);
        expect(invoice.address).toBe(invoiceProps.address);
        expect(invoice.items).toBe(invoiceProps.items);
    })

    it("should throw error when document is empty", () => {
        invoiceProps.document = "";

        expect(() =>  {
            new Invoice(invoiceProps);
        }).toThrow("Document is required");
    })


    it("should throw error when document is empty", () => {
        invoiceProps.document = "123";
        invoiceProps.address = null;

        expect(() =>  {
            new Invoice(invoiceProps);
        }).toThrow("Address is required");
    })

    it("should throw exception when there are no items", () => {
        invoiceProps.address = address;
        invoiceProps.items = [];

        expect(() =>  {
            new Invoice(invoiceProps);
        }).toThrow("At least one item is required");
    })
})