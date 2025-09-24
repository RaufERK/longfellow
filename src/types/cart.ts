export interface CartItem {
  productId: string
  title: string
  price: number // в рублях
  quantity: number
  thumbnailUrl?: string
  author?: string
}

export interface Cart {
  items: CartItem[]
  totalAmount: number // в рублях
  totalItems: number
  lastUpdated: string // ISO date
}

export interface OrderFormData {
  customerName: string
  customerSurname: string
  customerEmail: string
  customerPhone: string
  customerPhone2?: string
  customerPostalCode: string
  customerCity: string
  customerAddress: string
  deliveryType: string
  notes?: string
}

export interface CreateOrderRequest {
  items: CartItem[]
  customer: OrderFormData
  totalAmount: number
}

export interface CreateOrderResponse {
  success: boolean
  orderNumber?: number
  message: string
}

export const DELIVERY_TYPES = {
  POST: 'Почтой России',
} as const

export type DeliveryType = (typeof DELIVERY_TYPES)[keyof typeof DELIVERY_TYPES]
