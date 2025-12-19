import React from 'react';

function Icon({name}){
  if(name==='send') return (
    <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L21 3v6" stroke="#f7931a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M21 3v6l-7 2" stroke="#ffb88a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
    </svg>
  );
  if(name==='receive') return (
    <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12L3 21V15" stroke="#7af3ff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 21v-6l7-2" stroke="#48d1ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95"/>
    </svg>
  );
  if(name==='deposit') return (
    <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#b388ff" strokeWidth="1.4"/>
      <path d="M8 12h8" stroke="#e6d1ff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
  return (
    <svg className="action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v18" stroke="#ff9a9a" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M3 12h18" stroke="#ffd1d1" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

export default function ActionButtons({onOpenWithdraw}){
  function handleWithdrawClick(){
    // Signal parent to open the in-app withdraw modal (no browser prompt)
    if(typeof onOpenWithdraw === 'function') onOpenWithdraw();
  }

  return (
    <div className="actions">
      <button className="action-btn" title="Send"><Icon name="send"/><div style={{fontWeight:700}}>Send</div></button>
      <button className="action-btn" title="Receive"><Icon name="receive"/><div style={{fontWeight:700}}>Receive</div></button>
      <button className="action-btn" title="Deposit"><Icon name="deposit"/><div style={{fontWeight:700}}>Deposit</div></button>
      <button className="action-btn" title="Withdraw" onClick={handleWithdrawClick}><Icon name="withdraw"/><div style={{fontWeight:700}}>Withdraw</div></button>
    </div>
  );
}
