export interface PlaceOrderFacadeInputDto {
  clientId: string
  products: {
    productId: string
    salesPrice: number
  }[]
  
}

export interface PlaceOrderFacadeOutputDto {
  id: string
  invoiceId: string
  total: number
}

export default interface CheckoutFacadeInterface {
  placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto>
}