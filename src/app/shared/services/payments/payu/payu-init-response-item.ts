export interface PayuInitResponseItem {
  id: string;
  txnId: string;
  amount: number;
  currencyCode: string;
  productInfo: string;
  status: string;
  orderId: string;
  payuOrderId: string;
  redirectUri: string;
  continueUrl: string;
  notifyUrl: string;
  createdAt: string;
  updatedAt: string;
}
