import { api } from "@/shared/api";

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
}

export class PaymentService {
  static verifyPayment(data: PaymentVerificationRequest): Promise<void> {
    return api.post("/payment/api/payments/verify", data).then(() => undefined);
  }
}
