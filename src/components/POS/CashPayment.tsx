import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Banknote, Calculator } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface CashPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export function CashPayment({ amount, onSuccess, onCancel }: CashPaymentProps) {
  const [receivedAmount, setReceivedAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const received = parseFloat(receivedAmount) || 0;
  const change = received - amount;

  const quickAmounts = [
    Math.ceil(amount),
    Math.ceil(amount / 10) * 10,
    Math.ceil(amount / 20) * 20,
    Math.ceil(amount / 50) * 50,
  ].filter((v, i, arr) => arr.indexOf(v) === i); // Remove duplicates

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (received < amount) {
      toast.error('Received amount is less than total');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-1b17e9b2/api/payments/mock`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            method: 'cash',
            amount,
            received_amount: received,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Payment successful!');
        onSuccess(data.transaction_id);
      } else {
        toast.error(data.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Banknote className="w-5 h-5 text-amber-600" />
          <span className="text-amber-900">Cash Payment</span>
        </div>
        <div className="text-2xl text-amber-600">${amount.toFixed(2)}</div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="received-amount">Amount Received</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <Input
            id="received-amount"
            type="number"
            step="0.01"
            min={amount}
            placeholder="0.00"
            value={receivedAmount}
            onChange={(e) => setReceivedAmount(e.target.value)}
            className="pl-8 text-lg"
            required
            autoFocus
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {quickAmounts.map((quickAmount) => (
          <Button
            key={quickAmount}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setReceivedAmount(quickAmount.toString())}
            className="hover:bg-amber-50 hover:border-amber-300"
          >
            ${quickAmount}
          </Button>
        ))}
      </div>

      {received >= amount && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Amount Received:</span>
            <span className="text-green-600">${received.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span>${amount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-green-200">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-green-600" />
              <span className="text-green-900">Change:</span>
            </div>
            <span className="text-xl text-green-600">
              ${change.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {received > 0 && received < amount && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-sm text-red-800">
          ⚠️ Insufficient amount. Need ${(amount - received).toFixed(2)} more.
        </div>
      )}

      <div className="pt-2 space-y-2">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
          disabled={isProcessing || received < amount}
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Processing...
            </>
          ) : (
            'Confirm Cash Payment'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full">
          Cancel
        </Button>
      </div>
    </form>
  );
}
