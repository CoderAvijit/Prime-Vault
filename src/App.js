import React, {useState, useEffect} from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import WithdrawInfo from './components/WithdrawInfo';
import Signup from './components/Signup';
import SelectPlan from './components/SelectPlan';
import PaymentGateway from './components/PaymentGateway';

function App(){
  const [route, setRoute] = useState({name:'dashboard', params:null});

  function navigate(name, params=null){
    setRoute({name, params});
  }

  useEffect(()=>{
    try{
      const existing = localStorage.getItem('mockWalletPlan');
      if(!existing){
        const basic = { id: 'basic', name: 'Basic', price: 0, canDeposit:false, canWithdraw:false };
        localStorage.setItem('mockWalletPlan', JSON.stringify(basic));
      }
    }catch(e){ /* ignore storage errors */ }
  }, []);

  return (
    <div className="App dark-bg">
      {route.name === 'dashboard' && <Dashboard navigate={navigate} />}
      {route.name === 'withdraw-info' && <WithdrawInfo navigate={navigate} params={route.params} />}
      {route.name === 'signup' && <Signup navigate={navigate} params={route.params} />}
      {route.name === 'select-plan' && <SelectPlan navigate={navigate} params={route.params} />}
      {route.name === 'payment' && <PaymentGateway navigate={navigate} params={route.params} />}
    </div>
  );
}

export default App;
