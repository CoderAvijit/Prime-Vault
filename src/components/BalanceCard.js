import React from 'react';

function formatBTC(n){
  return n.toFixed(4) + ' BTC';
}

function formatUSD(n){
  return '$' + n.toLocaleString(undefined,{maximumFractionDigits:2});
}

export default function BalanceCard({btc, usd}){
  return (
    <div style={{display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <div>
          <div className="btc-amount">{formatBTC(btc)}</div>
          <div className="usd-amount">≈ {formatUSD(usd)}</div>
        </div>
        <div style={{marginLeft:'auto',textAlign:'right'}}>
          <div className="small-muted">24h Change</div>
          <div style={{fontWeight:700,color:'#9ef793'}}>+3.2%</div>
        </div>
      </div>
    </div>
  );
}
