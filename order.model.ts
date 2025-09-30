export interface Order {
  id: number;
  customerName: string;
  customerCpf: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  totalPrice: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'On Hold';
  orderDate: Date;
}