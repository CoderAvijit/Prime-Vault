import React, {useState} from 'react';

export default function Signup({navigate, params}){
  const [name, setName] = useState('');
  const [email,setEmail] = useState('');
  const [location,setLocation] = useState('');
  const [city,setCity] = useState('');
  const [phone,setPhone] = useState('');
  const [pw,setPw] = useState('');

  function validate(){
    if(!name.trim()) return 'Name is required';
    if(!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) return 'Valid email required';
    if(!location.trim()) return 'Location is required';
    if(!city.trim()) return 'City is required';
    if(!/^[+\d][\d\s()-]{6,20}$/.test(phone)) return 'Valid phone number required';
    if(pw.length < 6) return 'Password must be at least 6 characters';
    return null;
  }

  function handleSignup(e){
    e.preventDefault();
    const err = validate();
    if(err){
      alert(err);
      return;
    }

    const user = {name, email, location, city, phone, createdAt: new Date().toISOString()};
    try{
      localStorage.setItem('mockWalletUser', JSON.stringify(user));
    }catch(e){
      console.warn('localStorage error', e);
    }

    // After signup, redirect to plan selection and forward any requested withdraw amount
    navigate('select-plan', {user, requested: params && params.requested ? params.requested : null});
  }

  return (
    <div className="signup-panel">
      <div className="signup-header">
        <div className="signup-logo" aria-hidden>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v20" stroke="#f7931a" strokeWidth="1.6" strokeLinecap="round"/>
            <path d="M7 6h8" stroke="#f7931a" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M7 18h8" stroke="#f7931a" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div className="signup-title">Register for Bitcoin Wallet</div>
          <div className="signup-sub">Create your secure account to enable withdrawals and full platform access</div>
        </div>
      </div>

      <form onSubmit={handleSignup} style={{marginTop:20,display:'grid',gap:12}}>
        <div className="form-field">
          <label>Full name</label>
          <input placeholder="Jane Doe" value={name} onChange={e=>setName(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Email address</label>
          <input placeholder="name@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <div className="form-field">
            <label>Location (country)</label>
            <input placeholder="Country" value={location} onChange={e=>setLocation(e.target.value)} />
          </div>
          <div className="form-field">
            <label>City</label>
            <input placeholder="City" value={city} onChange={e=>setCity(e.target.value)} />
          </div>
        </div>

        <div className="form-field">
          <label>Phone number</label>
          <input placeholder="+1 555 555 5555" value={phone} onChange={e=>setPhone(e.target.value)} />
        </div>

        <div className="form-field">
          <label>Password</label>
          <input placeholder="Create password" type="password" value={pw} onChange={e=>setPw(e.target.value)} />
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">Create Account</button>
          <button className="btn-secondary" type="button" onClick={()=>navigate('dashboard')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
