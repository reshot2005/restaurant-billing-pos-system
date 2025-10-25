import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { CheckCircle2, Download, Printer } from "lucide-react";

interface ReceiptItem {
  name: string;
  qty?: number;
  quantity?: number;
  price?: number;
  unit_price?: number;
  subtotal?: number;
}

interface ReceiptData {
  orderId: string;
  items: ReceiptItem[];
  subtotal?: number;
  tax?: number;
  discount?: number;
  total?: number;
  paymentMethod?: string;
  transactionId?: string;
  timestamp?: string;
  tableNumber?: string;
}

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export function ReceiptModal({ open, onClose, receipt }: ReceiptModalProps) {
  if (!receipt) return null;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    const receiptData = JSON.stringify(receipt, null, 2);
    const blob = new Blob([receiptData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${receipt.orderId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-white/90 border-white/40 max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl">Payment Successful!</DialogTitle>
            <DialogDescription>Your order has been confirmed</DialogDescription>
          </div>
        </DialogHeader>

        <div className="receipt-content bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center mb-4">
            <h3 className="text-xl mb-1 font-semibold">Restaurant Name</h3>
            <p className="text-sm text-gray-600">Tax Invoice / Bill of Supply</p>
            <p className="text-xs text-gray-500 mt-2">
              {receipt.timestamp
                ? new Date(receipt.timestamp).toLocaleString()
                : ""}
            </p>
          </div>

          <Separator className="my-3" />

          <div className="space-y-1 mb-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono">
                #{receipt.orderId?.substring(0, 8)}
              </span>
            </div>
            {receipt.tableNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Table:</span>
                <span>{receipt.tableNumber}</span>
              </div>
            )}
            {receipt.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-gray-600">Payment:</span>
                <span className="capitalize">
                  {receipt.paymentMethod.replace("_", " ")}
                </span>
              </div>
            )}
            {receipt.transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-xs">
                  {receipt.transactionId.substring(0, 12)}...
                </span>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          {/* ✅ Items list - safe */}
          <div className="space-y-2 mb-3 text-sm">
            <div className="flex justify-between font-medium border-b pb-1">
              <span>Item</span>
              <span>Amount</span>
            </div>
            {receipt.items?.map((item, i) => {
              const price =
                Number(item.price ?? item.unit_price ?? 0) || 0;
              const qty = Number(item.qty ?? item.quantity ?? 1);
              const subtotal =
                Number(item.subtotal ?? price * qty) || 0;

              return (
                <div key={i} className="flex justify-between py-1">
                  <span>{item.name || "Unnamed Item"}</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <Separator className="my-3" />

          {/* ✅ Totals Section */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>₹{(receipt.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax:</span>
              <span>₹{(receipt.tax || 0).toFixed(2)}</span>
            </div>
            {receipt.discount && receipt.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{receipt.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-medium pt-1">
              <span>Total:</span>
              <span className="text-green-600">
                ₹{(receipt.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">Please visit again</p>
          </div>
        </div>

        {/* ✅ Buttons */}
        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 mt-2"
        >
          New Order
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ✅ Print styles (auto-applied globally)
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      .receipt-content, .receipt-content * {
        visibility: visible;
      }
      .receipt-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
}
