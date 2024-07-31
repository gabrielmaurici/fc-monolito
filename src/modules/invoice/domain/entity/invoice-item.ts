import AggregateRoot from "../../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../../@shared/domain/entity/base.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

type InvoiceItemProps = {
    id?: Id,
    name: string,
    price: number
};

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
    private _name: string;
    private _price: number;

    constructor(props: InvoiceItemProps) {
        super(props.id)
        this._name = props.name,
        this._price = props.price
        this.validate()
    }
    
    private validate(): void {
        if (this._name.length <= 0) {
            throw new Error("Name is required");
        }

        if (this._price <= 0) {
            throw new Error("Price must be greater than 0");
        }
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }

    static mapInvoiceItems(items: any[]): InvoiceItem[] {
        return items.map(item =>
          new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price
          })
        );
    }
}