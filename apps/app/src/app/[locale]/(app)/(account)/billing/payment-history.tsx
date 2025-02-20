import { Card } from "@kouza/ui/components/card"
import type Stripe from "stripe"

interface PaymentHistoryProps {
  payments: Stripe.PaymentIntent[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      <div className="space-y-4">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="flex justify-between items-center py-3 border-b last:border-0"
          >
            <div className="space-y-1">
              <p className="font-medium">${payment.amount / 100}</p>
              <p className="text-sm text-gray-500">
                {new Date(payment.created * 1000).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  payment.status === "succeeded"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {payment.status}
              </span>

              {payment.payment_method && (
                <span className="text-sm text-gray-500">
                  ••••{" "}
                  {(payment.payment_method as Stripe.PaymentMethod).card?.last4}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
