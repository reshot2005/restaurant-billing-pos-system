import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { CreditCard, Smartphone, Building2, Banknote, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { CreditCardPayment } from './CreditCardPayment';
import { UPIPayment } from './UPIPayment';
import { NetbankingPayment } from './NetbankingPayment';
import { CashPayment } from './CashPayment';

type PaymentMethod = 'credit_card' | 'upi' | 'netbanking' | 'cash' | null;

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onPaymentSuccess: (method: string, transactionId: string) => void;
}

export function PaymentModal({ open, onClose, total, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);

  const paymentMethods = [
    { id: 'credit_card', name: 'Credit/Debit Card', icon: CreditCard, color: 'from-blue-400 to-blue-600' },
    { id: 'upi', name: 'UPI', icon: Smartphone, color: 'from-purple-400 to-purple-600' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, color: 'from-green-400 to-green-600' },
    { id: 'cash', name: 'Cash', icon: Banknote, color: 'from-amber-400 to-amber-600' },
  ];

  const handleBack = () => {
    setSelectedMethod(null);
  };

  const handleSuccess = (transactionId: string) => {
    onPaymentSuccess(selectedMethod!, transactionId);
    setSelectedMethod(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-white/90 border-white/40 max-w-md">
        <DialogHeader>
          <DialogTitle>Payment</DialogTitle>
          <DialogDescription>
            {selectedMethod ? 'Complete your payment' : 'Choose a payment method'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {!selectedMethod ? (
            <>
              <div className="mb-6 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                <div className="text-3xl text-sky-600">${total.toFixed(2)}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                    className="p-4 rounded-lg border-2 border-gray-200 hover:border-sky-300 transition-all group"
                  >
                    <div className={`w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                      <method.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-center group-hover:text-sky-600 transition-colors">
                      {method.name}
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleBack}
                className="mb-4"
              >
                ← Back to payment methods
              </Button>

              {selectedMethod === 'credit_card' && (
                <CreditCardPayment
                  amount={total}
                  onSuccess={handleSuccess}
                  onCancel={handleBack}
                />
              )}
              {selectedMethod === 'upi' && (
                <UPIPayment
                  amount={total}
                  onSuccess={handleSuccess}
                  onCancel={handleBack}
                />
              )}
              {selectedMethod === 'netbanking' && (
                <NetbankingPayment
                  amount={total}
                  onSuccess={handleSuccess}
                  onCancel={handleBack}
                />
              )}
              {selectedMethod === 'cash' && (
                <CashPayment
                  amount={total}
                  onSuccess={handleSuccess}
                  onCancel={handleBack}
                />
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
