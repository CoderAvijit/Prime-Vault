import React, {useState, useEffect} from 'react';
import LoginHeader from './LoginHeader';
import BalanceCard from './BalanceCard';
import ActionButtons from './ActionButtons';
import TransactionList from './TransactionList';
import PriceChart from './PriceChart';
import '../App.css';

const sampleTx = [
  { id:1, type:'Sent', addr:'bc1qxy...', time:'2m ago', amount:'-0.005 BTC' },
  { id:2, type:'Received', addr:'bc1z9r...', time:'10m ago', amount:'+0.120 BTC' },
  { id:3, type:'Deposit', addr:'onchain', time:'1h ago', amount:'+0.300 BTC' },
  { id:4, type:'Withdraw', addr:'exchange', time:'yesterday', amount:'-0.040 BTC' },
];

export default function Dashboard({navigate}){
  // set BTC to 4.something per request (static balance for mock)
  const btc = 4.1583;
  const [price, setPrice] = useState(47000); // will be updated from live feed
  const usdEquivalent = btc * price;

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawValue, setWithdrawValue] = useState('');
  const [withdrawError, setWithdrawError] = useState(null);

  useEffect(()=>{
    let mounted = true;
    async function fetchPrice(){
      try{
        const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
        if(!r.ok) return;
        const j = await r.json();
        const p = parseFloat(j.price);
        if(mounted && Number.isFinite(p)) setPrice(p);
      }catch(e){
        // ignore network errors silently
      }
    }
    fetchPrice();
    const id = setInterval(fetchPrice, 5000);
    return ()=>{ mounted = false; clearInterval(id); };
  },[]);

  // Withdrawal processing was previously handled here but is not
  // invoked directly because the UI now opens an in-app modal and
  // redirects unsigned users to sign-up/plan flow. Keep logic minimal
  // in this component to avoid unused-function ESLint warnings.

  return (
    <div className="dashboard">
      <div className="main-left">
        <div className="panel header-row">
          <LoginHeader />
        </div>

        <div className="panel balance-card">
          <BalanceCard btc={btc} usd={usdEquivalent} />
          <ActionButtons onOpenWithdraw={()=>{ setWithdrawValue(''); setWithdrawError(null); setShowWithdrawModal(true); }} />
        </div>

        {showWithdrawModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Enter amount to withdraw (BTC)</div>
              <input autoFocus value={withdrawValue} onChange={e=>{ setWithdrawValue(e.target.value); setWithdrawError(null); }} placeholder="0.1000" style={{padding:10,borderRadius:8,background:'#0b0b0c',border:'1px solid rgba(255,255,255,0.04)',color:'#e6eef8'}} />
              {withdrawError && <div style={{color:'#ffb3a1',marginTop:8}}>{withdrawError}</div>}
              <div style={{display:'flex',gap:10,marginTop:12}}>
                <button className="btn-primary" onClick={()=>{
                  const val = parseFloat(withdrawValue);
                  if(isNaN(val) || val <= 0){ setWithdrawError('Enter a valid BTC amount'); return; }
                  if(val > btc){ setWithdrawError('Amount exceeds available balance'); return; }
                  // close modal and redirect to signup with requested amount
                  setShowWithdrawModal(false);
                  navigate('signup', {requested: val});
                }}>Done</button>
                <button className="btn-secondary" onClick={()=>{ setShowWithdrawModal(false); setWithdrawError(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="panel">
          <div className="header-row" style={{marginBottom:8}}>
            <div>
              <div style={{fontSize:16,fontWeight:700}}>Transaction History</div>
              <div className="small-muted">Recent on-chain activity</div>
            </div>
            <div className="small-muted">Showing 4 of 128</div>
          </div>
          <div className="tx-list">
            <TransactionList items={sampleTx} />
          </div>
        </div>
      </div>

      <div className="right-column">
        <div className="panel chart-wrap">
          <div className="header-row" style={{marginBottom:8}}>
            <div>
              <div style={{fontSize:16,fontWeight:700}}>BTC / USD</div>
              <div className="small-muted">Real-time price (simulated)</div>
            </div>
            <div className="accent">+1.8%</div>
          </div>
          <PriceChart />
        </div>

        <div className="panel">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{fontWeight:700}}>Account Overview</div>
            <div className="small-muted">As of now</div>
          </div>
          <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <div style={{padding:12,background:'rgba(255,255,255,0.01)',borderRadius:10}}>
              <div className="small-muted">Available</div>
              <div style={{fontWeight:700,marginTop:6}}>{btc.toFixed(4)} BTC</div>
            </div>
            <div style={{padding:12,background:'rgba(255,255,255,0.01)',borderRadius:10}}>
              <div className="small-muted">Locked</div>
              <div style={{fontWeight:700,marginTop:6}}>0.2000 BTC</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
