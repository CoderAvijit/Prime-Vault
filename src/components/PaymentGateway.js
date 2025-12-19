import React, { useState } from 'react';

export default function PaymentGateway({ navigate, params }) {
  const [method, setMethod] = useState(null); 
  const [status, setStatus] = useState('idle'); 
  const planId = params && params.planId ? params.planId : 'pro';
  const price = params && params.price ? params.price : 0;
  const requested = params && params.requested ? params.requested : null;

  const theme = {
    primary: '#3395FF', 
    dark: '#02042B',    
    text: '#515978',    
    border: '#E8EBF1',  
    bg: '#F8FAFC'       
  };

  // --- Logic remains the same ---
  function finalizePayment() {
    try {
      const pendingRaw = localStorage.getItem('mockWalletPendingPlan');
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw);
        localStorage.setItem('mockWalletPlan', JSON.stringify(pending));
        localStorage.removeItem('mockWalletPendingPlan');
      }
    } catch (e) {}
    setStatus('confirmed');
    setTimeout(() => navigate('dashboard'), 800);
  }

  async function startCard() {
    setMethod('card');
    setStatus('processing');
    try {
      const res = await fetch('http://localhost:8080/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: price, currency: 'USD', planId })
      });
      const json = await res.json();
      const { orderId, amount, currency, keyId } = json;

      await new Promise((resolve) => {
        if (window.Razorpay) return resolve();
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        order_id: orderId,
        name: 'Mock BTC Wallet',
        description: planId.toUpperCase() + ' Plan',
        modal: { ondismiss: () => setStatus('idle') },
        handler: async (response) => {
          const v = await fetch('http://localhost:8080/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          const vr = await v.json();
          if (v.ok && vr.verified) finalizePayment();
          else { setStatus('idle'); alert('Failed'); }
        },
        theme: { color: theme.primary }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setStatus('idle');
    }
  }

  return (
    <div style={{
      maxWidth: '650px', // INCREASED SIZE
      margin: '60px auto',
      backgroundColor: '#fff',
      borderRadius: '16px', // Rounded corners
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', // Heavier shadow
      overflow: 'hidden',
      fontFamily: "'Segoe UI', Roboto, Helvetica, sans-serif"
    }}>
      {/* HEADER: LARGER & DARKER */}
      <div style={{ backgroundColor: theme.dark, padding: '40px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>Complete Payment</h2>
            <p style={{ margin: '8px 0 0', fontSize: '16px', opacity: 0.7 }}>Select your preferred payment method</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '1px' }}>Total Amount</div>
            <div style={{ fontSize: '36px', fontWeight: 900 }}>${price}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px' }}>
        {/* PAYMENT OPTIONS: TALLER BOXES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <MethodBox 
            label="Card" 
            sub="Visa / Mastercard" 
            active={method === 'card'} 
            onClick={startCard} 
            theme={theme} 
          />
          <MethodBox 
            label="Bank" 
            sub="ACH / Wire Transfer" 
            active={method === 'bank'} 
            onClick={() => setMethod('bank')} 
            theme={theme} 
          />
          <MethodBox 
            label="Crypto" 
            sub="Bitcoin (BTC)" 
            active={method === 'crypto'} 
            onClick={() => setMethod('crypto')} 
            theme={theme} 
          />
        </div>

        {/* ORDER SUMMARY */}
        <div style={{ 
          backgroundColor: theme.bg, 
          padding: '20px 24px', 
          borderRadius: '12px', 
          fontSize: '16px', 
          borderLeft: `6px solid ${theme.primary}`,
          display: 'flex',
          justifyContent: 'space-between',
          color: theme.text
        }}>
          <span><strong>Order Detail:</strong> {planId} plan</span>
          {requested && <span style={{fontWeight: 600}}>{requested} BTC</span>}
        </div>

        {/* ACTION AREA */}
        <div style={{ marginTop: '40px', minHeight: '140px' }}>
          {method === 'card' && (
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={startCard}
                style={{
                  width: '100%',
                  padding: '18px',
                  backgroundColor: theme.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '18px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px 0 rgba(51, 149, 255, 0.39)'
                }}
              >
                {status === 'processing' ? 'Opening Secure Checkout...' : 'Pay Now'}
              </button>
              <p style={{ marginTop: '16px', fontSize: '14px', color: '#94a3b8' }}>
                You will be redirected to Razorpay's secure payment page.
              </p>
            </div>
          )}

          {method === 'bank' && (
            <div style={{ border: `2px dashed ${theme.border}`, padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>Bank Transfer Details</p>
              <div style={{ fontSize: '16px', background: '#f1f5f9', padding: '15px', borderRadius: '8px', fontFamily: 'monospace' }}>
                Account: 1234 5678 9012 <br/> Routing: 011000015
              </div>
              <button 
                onClick={finalizePayment}
                style={{ width: '100%', marginTop: '20px', padding: '15px', backgroundColor: theme.dark, color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                Confirm I've Sent Funds
              </button>
            </div>
          )}

          {method === null && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#cbd5e1', fontSize: '18px', border: `2px dashed ${theme.border}`, borderRadius: '12px' }}>
              Please select a payment method above to continue
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button 
            onClick={() => navigate('select-plan')}
            style={{ background: 'none', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer', fontSize: '15px' }}
          >
            Cancel transaction
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#F8FAFC', borderTop: `1px solid ${theme.border}`, letterSpacing: '2px', fontSize: '12px', color: '#94a3b8' }}>
        SECURED BY <strong style={{ color: theme.primary }}>RAZORPAY</strong>
      </div>
    </div>
  );
}

// Sub-component for Method Boxes
function MethodBox({ label, sub, active, onClick, theme }) {
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '24px 12px',
        textAlign: 'center',
        borderRadius: '12px',
        border: `2px solid ${active ? theme.primary : theme.border}`,
        backgroundColor: active ? '#F0F7FF' : '#fff',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        transform: active ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div style={{ fontWeight: 800, fontSize: '18px', color: active ? theme.primary : theme.dark }}>{label}</div>
      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>{sub}</div>
    </div>
  );
}