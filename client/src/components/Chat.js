import React, { useEffect, useState } from 'react';
import '../App.css';

function Chat({ username }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const eventSource = new EventSource(`http://localhost:8080/sse?username=${username}`);

        eventSource.onmessage = function(event) {
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        return () => {
            eventSource.close();
        };
    }, [username]);

    const sendMessage = async () => {
        if (input.trim()) {
            await fetch(`http://localhost:8080/chat?username=${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(input),
            });
            setInput('');
        }
    };

    return (
        <div className="Chat">
            <h1>Chat Room</h1>
            <div className="chat-box">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        {message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        sendMessage();
                    }
                }}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}


export default Chat;
