import { OrderStatus } from "./order-status";

export enum FilterOrderStatus {
 all = -1,
 pending = OrderStatus.pending,
 shipped = OrderStatus.shipped,
 cancelled = OrderStatus.cancelled,
}
