import React, {useEffect, useState} from 'react';

export default function WithdrawInfo({navigate, params}){
  const [count, setCount] = useState(5);

  useEffect(()=>{
    const t = setInterval(()=>{
      setCount(c=>c-1);
    },1000);
    const to = setTimeout(()=>{
      // forward the requested withdraw amount to signup
      navigate('signup', params);
    },5000);
    return ()=>{ clearInterval(t); clearTimeout(to); };
  },[navigate, params]);

  return (
    <div className="panel" style={{maxWidth:720,margin:'40px auto',textAlign:'center'}}>
      <div style={{fontSize:20,fontWeight:800}}>Account Required</div>
      <div className="small-muted" style={{marginTop:8}}>To withdraw you must have an account in this application.</div>
      <div style={{marginTop:18}}>
        <button className="action-btn" onClick={()=>navigate('signup')}>Go to Sign Up</button>
      </div>
      <div className="small-muted" style={{marginTop:12}}>Automatically redirecting to sign up in {count}s…</div>
    </div>
  );
}
