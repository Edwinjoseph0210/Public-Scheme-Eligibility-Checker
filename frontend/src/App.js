import React, { useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({
    age: '',
    gender: '',
    income: '',
    occupation: '',
    caste: '',
    education: '',
    state: ''
  });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState('form');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:5000/schemes/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        income: Number(form.income)
      })
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const handleQuerySubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('http://localhost:5000/schemes/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const groupedResults = results.reduce((acc, scheme) => {
    acc[scheme.category] = acc[scheme.category] || [];
    acc[scheme.category].push(scheme);
    return acc;
  }, {});

  return (
    <div className="App">
      <header className="App-header">
        <h1>Public Scheme Eligibility Checker</h1>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setMode('form')} disabled={mode==='form'}>Form Mode</button>
          <button onClick={() => setMode('query')} disabled={mode==='query'}>Query Mode</button>
        </div>
        {mode === 'form' ? (
          <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400, margin: '0 auto' }}>
            <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
            <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} />
            <input name="income" type="number" placeholder="Income" value={form.income} onChange={handleChange} />
            <input name="occupation" placeholder="Occupation" value={form.occupation} onChange={handleChange} />
            <input name="caste" placeholder="Caste" value={form.caste} onChange={handleChange} />
            <input name="education" placeholder="Education" value={form.education} onChange={handleChange} />
            <input name="state" placeholder="State" value={form.state} onChange={handleChange} />
            <button type="submit" disabled={loading}>{loading ? 'Checking...' : 'Check Eligibility'}</button>
          </form>
        ) : (
          <form onSubmit={handleQuerySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 400, margin: '0 auto' }}>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="E.g. What schemes for a 23-year-old unemployed graduate from Kerala?" required />
            <button type="submit" disabled={loading}>{loading ? 'Checking...' : 'Ask'}</button>
          </form>
        )}
        <div style={{ marginTop: 32, width: '100%', maxWidth: 600 }}>
          {results.length > 0 && (
            <>
              <h2>Eligible Schemes</h2>
              {Object.keys(groupedResults).map(cat => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <h3>{cat}</h3>
                  <ul>
                    {groupedResults[cat].map(scheme => (
                      <li key={scheme.id}>
                        <strong>{scheme.name}</strong> - <a href={scheme.apply_link} target="_blank" rel="noopener noreferrer">Apply</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          )}
          {results.length === 0 && !loading && <p>No schemes matched yet.</p>}
        </div>
      </header>
    </div>
  );
}

export default App;
