export interface PayuInitResponseItem {
  id: string;
  txnId: string;
  firstName: string;
  email: string;
  mobile: string;
  amount: number;
  productInfo: string;
  status: string;
  hash: string;
  gatewayPaymentId: string;
  isHashValid: boolean;
  gatewayResponse: unknown;
  createdAt: string;
  updatedAt: string;
  action: string;
  method: 'POST';
  params: Record<string, any>;
}
