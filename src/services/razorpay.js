export function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function initiatePayment({ userName, userEmail, userPhone, onSuccess, onFailure }) {
  const loaded = await loadRazorpay();
  if (!loaded) { onFailure('RAZORPAY_LOAD'); return; }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: 4900, currency: 'INR',
    name: 'HireReady AI',
    description: 'Resume + Cover Letter + LinkedIn PDF Download',
    prefill: { name: userName, email: userEmail, contact: userPhone },
    notes: { product: 'resume_download_v1' },
    theme: { color: '#00C8FF' },
    handler: response => {
      localStorage.setItem('hireready_payment', JSON.stringify({
        paymentId: response.razorpay_payment_id,
        paidAt: Date.now(),
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        downloaded: false,
      }));
      onSuccess(response.razorpay_payment_id);
    },
    modal: { ondismiss: () => onFailure('PAYMENT_CANCELLED') },
  };

  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', () => onFailure('PAYMENT_FAIL'));
  rzp.open();
}
