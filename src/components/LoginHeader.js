import React from 'react';

export default function LoginHeader(){
  return (
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{fontWeight:800,fontSize:18}}>Premium Wallet</div>
        <div style={{color:'var(--muted)',fontSize:13}}>Secure session • 2FA enabled</div>
      </div>

      <div className="login-header">
        <input className="login-input" placeholder="Username" defaultValue="munro.colin" />
        <input className="login-input" placeholder="Password" type="password" defaultValue="••••••••" />
        <button className="btn-logout">Logout</button>
      </div>
    </div>
  );
}
