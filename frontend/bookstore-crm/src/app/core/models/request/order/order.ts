import { OrderItemRequestParameter } from "./order-item";

export interface OrderRequestParameter {
    userId: string;
    items: OrderItemRequestParameter[];
}