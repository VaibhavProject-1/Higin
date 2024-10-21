import crypto from 'crypto';

export const generatePaymentLink = (customerId, totalAmount) => {
  const upiId = 'merchantupi@bank';
  const transactionId = crypto.randomBytes(16).toString('hex');
  const upiLink = `upi://pay?pa=${upiId}&pn=Merchant&tid=${transactionId}&am=${totalAmount}&cu=INR`;

  return upiLink;
};