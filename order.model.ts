export interface Order {
  id: number;
  customerName: string;
  customerCpf: string;
  customerPhone: string;
  customerEmail: string;
  serviceName: string;
  totalPrice: number;
  status: 'Pendente' | 'Em Processo' | 'Finalizado';
  orderDate: Date;
  height?: number | null;
  width?: number | null;
  length?: number | null;
}