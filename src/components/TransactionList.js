import React from 'react';

export default function TransactionList({items=[]}){
  return (
    <div>
      {items.map(it => (
        <div key={it.id} className="tx-item" style={{marginBottom:8,background:'transparent'}}>
          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{fontWeight:700}}>{it.type} <span className="small-muted">• {it.addr}</span></div>
            <div className="tx-meta">{it.time}</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="tx-amount">{it.amount}</div>
            <div className="small-muted">Confirmed</div>
          </div>
        </div>
      ))}
    </div>
  );
}
