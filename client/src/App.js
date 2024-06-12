import React, { useState } from 'react';
import Chat from './components/Chat';

function App() {
    const [username, setUsername] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = () => {
        if (username.trim()) {
            setIsLoggedIn(true);
        }
    };


    return (
        <div className="App">
            {!isLoggedIn ? (
                <div className="login">
                    <h2>Enter your name to join the chat</h2>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleLogin}>Join</button>
                </div>
            ) : (
                <Chat username={username} />
            )}
        </div>
    );
}

export default App;
