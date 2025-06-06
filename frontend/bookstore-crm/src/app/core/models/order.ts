import { OrderStatus } from "./enums/order-status";
import { OrderItem } from "./order-item";
import { User } from "./user"

export interface Order {
    id: string
    user: User
    createdAt: Date;
    updatedAt: Date;
    status: OrderStatus;
    items: OrderItem[];
    totalPrice: number;
}