import React from 'react';

const PLANS = [
  {id:'basic', name:'Basic', price:0, features:[
    'Account access',
    'View balances & charts',
    'No deposit permissions',
    'No withdrawal permissions'
  ], canDeposit:false, canWithdraw:false},
  {id:'pro', name:'Pro', price:9.99, features:[
    'Deposit BTC enabled',
    'View balances & charts',
    'Faster API limits',
    'Withdrawals disabled'
  ], canDeposit:true, canWithdraw:false},
  {id:'premium', name:'Premium', price:29.99, features:[
    'Deposit BTC enabled',
    'Withdraw BTC enabled',
    'Priority support',
    'Higher limits & advanced tools'
  ], canDeposit:true, canWithdraw:true}
];

export default function SelectPlan({navigate, params}){
  let stored = null;
  try{ stored = JSON.parse(localStorage.getItem('mockWalletPlan')); }catch(e){ stored = null; }
  if(!stored){
    const basicPlan = PLANS.find(p=>p.id==='basic') || { id: 'basic', name:'Basic', price:0, canDeposit:false, canWithdraw:false };
    try{ localStorage.setItem('mockWalletPlan', JSON.stringify(basicPlan)); }catch(e){}
    stored = basicPlan;
  }
  const currentPlanId = stored && stored.id ? stored.id : 'basic';

  function choose(plan){
    // For paid plans, redirect to a (mock) payment gateway and store a pendingPlan
    if(plan.price && plan.price > 0){
      // store pending plan and open in-app payment flow
      try{ localStorage.setItem('mockWalletPendingPlan', JSON.stringify(plan)); }catch(e){}
      navigate('payment', { planId: plan.id, price: plan.price, requested: params && params.requested ? params.requested : null });
      return;
    }

    // free plan: persist immediately and go to dashboard
    try{ localStorage.setItem('mockWalletPlan', JSON.stringify(plan)); }catch(e){}
    if(params && params.requested){
      if(plan.canWithdraw){
        alert(`Selected ${plan.name} plan — $${plan.price} / month. You can now withdraw ${params.requested} BTC.`);
      }else{
        alert(`Selected ${plan.name} plan — $${plan.price} / month.`);
      }
    }else{
      alert(`Selected ${plan.name} plan — $${plan.price} / month`);
    }
    navigate('dashboard');
  }

  return (
    <div className="plans-panel">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontSize:20,fontWeight:800,color:'#fff'}}>Choose a plan</div>
          <div className="small-muted">Select the plan that fits your needs</div>
        </div>
        <div className="small-muted">Billing in USD</div>
      </div>

      <div style={{marginTop:10}}>
        {params && params.requested ? (
          <div style={{color:'#ffd9b8',marginBottom:8,fontWeight:700}}>You attempted to withdraw {params.requested} BTC — select a plan to enable withdrawals.</div>
        ) : null}
      </div>

      <div className="plans-grid">
        {PLANS.map(p=> (
          <div key={p.id} className="plan-card">
            <div className="plan-name">{p.name} {p.id==='premium' && <span className="plan-badge">Popular</span>}</div>
            <ul className="plan-features">
              {p.features.map((f,i)=> <li key={i}>{f}</li>)}
            </ul>
            <div className="plan-price">{'$'}{p.price}{p.price===0?'/free':'/mo'}</div>
            <div className="plan-cta">
              {p.id === currentPlanId ? (
                <div className="plan-active">Active for you</div>
              ) : (
                (()=>{
                  const label = p.price === 0 ? 'Select Free' : 'Subscribe';
                  return <button className="action-btn plan-choose" onClick={()=>choose(p)}>{label}</button>;
                })()
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
