import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Building2, ShieldCheck } from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface NetbankingPaymentProps {
  amount: number;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const banks = [
  'State Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Bank of Baroda',
  'Punjab National Bank',
  'Canara Bank',
];

export function NetbankingPayment({ amount, onSuccess, onCancel }: NetbankingPaymentProps) {
  const [selectedBank, setSelectedBank] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'bank' | 'credentials' | 'otp'>('bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank) {
      toast.error('Please select a bank');
      return;
    }
    setStep('credentials');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !password) {
      toast.error('Please enter user ID and password');
      return;
    }
    // Simulate sending OTP
    toast.success('OTP sent to your registered mobile number');
    setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
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
            method: 'netbanking',
            amount,
            bank_name: selectedBank,
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
    <div className="space-y-4">
      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-green-600" />
          <span className="text-green-900">Net Banking</span>
        </div>
        <div className="text-2xl text-green-600">${amount.toFixed(2)}</div>
      </div>

      {step === 'bank' && (
        <form onSubmit={handleBankSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank">Select Your Bank</Label>
            <Select value={selectedBank} onValueChange={setSelectedBank}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a bank" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure connection to your bank</span>
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Continue to Bank Login
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          </div>
        </form>
      )}

      {step === 'credentials' && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg text-sm text-center">
            <p className="text-blue-900">{selectedBank}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-id">User ID</Label>
            <Input
              id="user-id"
              type="text"
              placeholder="Enter your user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Login & Generate OTP
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('bank')}
              className="w-full"
            >
              Back
            </Button>
          </div>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div className="p-3 bg-green-50 rounded-lg text-sm text-center">
            <p className="text-green-900">OTP sent to your registered mobile number</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
              required
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
          </div>

          <p className="text-xs text-center text-gray-500">
            Test OTP: 123456
          </p>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                `Verify & Pay $${amount.toFixed(2)}`
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('credentials')}
              className="w-full"
              disabled={isProcessing}
            >
              Back
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
