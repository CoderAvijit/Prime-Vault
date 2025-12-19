import React, {useEffect, useRef, useState} from 'react';

// This component uses Binance public REST to seed recent klines and
// then opens a Binance websocket to receive live trades for BTCUSDT.
// If websocket is unavailable, it falls back to polling the REST price.

async function fetchKlines(limit=120){
  try{
    const resp = await fetch(`https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=${limit}`);
    if(!resp.ok) throw new Error('Klines fetch failed');
    const json = await resp.json();
    // kline format: [ openTime, open, high, low, close, ... ]
    return json.map(k => parseFloat(k[4]));
  }catch(err){
    console.warn('fetchKlines error', err);
    return null;
  }
}

export default function PriceChart(){
  const [data,setData] = useState([]);
  const [lastPrice,setLastPrice] = useState(null);
  const wsRef = useRef(null);
  const mounted = useRef(false);

  useEffect(()=>{
    let pollInterval = null;
    mounted.current = true;

    // Seed initial series from Binance klines
    (async ()=>{
      const kl = await fetchKlines(120);
      if(kl && kl.length){
        if(!mounted.current) return;
        setData(kl);
        setLastPrice(kl[kl.length-1]);
      }else{
        // fallback: try a single price fetch
        try{
          const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
          const j = await r.json();
          const p = parseFloat(j.price);
          setData(Array(60).fill(p));
          setLastPrice(p);
        }catch(e){
          console.warn('fallback price fetch failed', e);
        }
      }

      // Open websocket to stream trades
      try{
        const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
        wsRef.current = ws;
        ws.onmessage = (ev) => {
          try{
            const msg = JSON.parse(ev.data);
            // trade message has p = price string
            const price = parseFloat(msg.p);
            if(Number.isFinite(price)){
              setData(d => {
                const nd = d.length ? [...d.slice(-119), price] : [price];
                return nd;
              });
              setLastPrice(price);
            }
          }catch(err){
            console.warn('ws parse error', err);
          }
        };

        ws.onopen = ()=>{
          // nothing to send for trade stream
        };

        ws.onerror = (e)=>{
          console.warn('binance ws error', e);
        };

        ws.onclose = ()=>{
          // if websocket closes, fallback to polling every 5s
          if(mounted.current){
            pollInterval = setInterval(async ()=>{
              try{
                const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
                const j = await r.json();
                const p = parseFloat(j.price);
                setData(d => [...d.slice(-119), p]);
                setLastPrice(p);
              }catch(e){
                console.warn('poll fallback failed', e);
              }
            },5000);
          }
        };
      }catch(err){
        console.warn('ws creation failed, will poll', err);
        pollInterval = setInterval(async ()=>{
          try{
            const r = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT');
            const j = await r.json();
            const p = parseFloat(j.price);
            setData(d => [...d.slice(-119), p]);
            setLastPrice(p);
          }catch(e){
            console.warn('poll fallback failed', e);
          }
        },5000);
      }
    })();

    return ()=>{
      mounted.current = false;
      if(wsRef.current){
        try{ wsRef.current.close(); }catch(_){}
      }
      if(pollInterval) clearInterval(pollInterval);
    };
  },[]);

  // render
  const width = 640; const height = 240; const padding=10;
  const d = data.length ? data : [0];
  const max = Math.max(...d); const min=Math.min(...d);
  const span = Math.max(1,max-min);
  const pts = d.map((v,i)=>{
    const x = padding + (i/(d.length-1 || 1))*(width-padding*2);
    const y = padding + (1 - (v-min)/span)*(height-padding*2);
    return `${x},${y}`;
  }).join(' ');

  const displayPrice = lastPrice ? lastPrice.toFixed(2) : '—';

  return (
    <div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
        <div style={{fontWeight:800,fontSize:18}}>USD {displayPrice}</div>
        <div className="small-muted">Live Binance feed</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{width:'100%',height:'100%'}}>
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffb677" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#ffb677" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={pts} fill="none" stroke="#f7931a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        {d.length>0 && (
          <polygon points={`${pts} ${width-padding},${height-padding} ${padding},${height-padding}`} fill="url(#g1)" opacity="0.6" />
        )}
      </svg>
    </div>
  );
}
