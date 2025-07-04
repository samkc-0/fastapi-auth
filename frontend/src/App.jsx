import React, { useState } from 'react';
import { login, getMe } from './services/api';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { access_token } = await login(username, password);
      const meData = await getMe(access_token);
      setUser(meData);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
      setUser(null);
    }
  };

  return (
    <div className="App">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <h2>Welcome</h2>
          <p>{user.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;