import React, { useState, useEffect, useRef } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello there! I'm Edu-Bot, your virtual assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load API Key from environment variable
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
  
  // Website context to ground the chatbot's knowledge
  const websiteContext = `
    You are Edu-Bot, a helpful assistant for the website named "EduX".
    The website's primary mission is to predict and prevent student dropouts by empowering educators with data-driven insights.
    The platform's main features include:
    - **Holistic Student Dashboard**: A consolidated view of student attendance, test scores, and fees.
    - **Automated Risk Flagging**: Identifies at-risk students with a color-coded system (red for high risk, orange for medium, green for low).
    - **Performance Trends Analysis**: Visualizes student progress over time.
    - **Proactive Mentor Notifications**: Sends alerts to mentors and guardians.
    - **Multi-Factor Risk Analysis**: Combines various data points for a comprehensive risk score.
    - **Secure Data Management**: Ensures the privacy and security of student data.
    The main user roles are "Admin/Mentor" and "Student", each with their own dashboard.
  `;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Check if the API key is available before sending
    if (!API_KEY) {
        const errorMessage = { text: "Error: API Key is not configured. Please set REACT_APP_GEMINI_API_KEY in your .env.local file.", sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        return;
    }

    const userMessageText = input.trim();
    const userMessage = { text: userMessageText, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const prompt = `${websiteContext} User Message: "${userMessageText}" Response:`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: {
          parts: [{ text: "You are Edu-Bot, a helpful and positive chatbot. Always respond with a positive and encouraging tone." }]
        },
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      const botResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const botMessage = { text: botResponseText, sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Failed to fetch response:", error);
      const errorMessage = { text: "I'm sorry, I am currently unable to provide a response. Please try again later.", sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chatbot-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
      <div className="chatbot-box" style={{ width: '100%', maxWidth: '1000px', height: '80vh', maxHeight: '700px', backgroundColor: '#1a1a1a', border: '2px solid #333', borderRadius: '10px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.5)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="chatbot-header" style={{ backgroundColor: '#facc15', color: '#121212', padding: '5px 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <svg className="chatbot-icon" style={{ width: '35px', height: '35px', color: '#121212' }} fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          <h2 className="chatbot-title" style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>Edu-Bot</h2>
        </div>
        <div className="chatbot-messages" style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.sender}`} style={{ padding: '12px 18px', borderRadius: '20px', maxWidth: '80%', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', backgroundColor: message.sender === 'user' ? '#facc15' : '#333', color: message.sender === 'user' ? '#121212' : '#fff', alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble bot" style={{ padding: '12px 18px', borderRadius: '20px', maxWidth: '80%', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', backgroundColor: '#333', color: '#fff', alignSelf: 'flex-start' }}>
              <span>Edu-Bot is typing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="chatbot-input" style={{ display: 'flex', padding: '15px', backgroundColor: '#1f1f1f', borderTop: '1px solid #333' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field"
            disabled={isLoading}
            style={{ flexGrow: 1, padding: '10px 15px', border: '1px solid #555', borderRadius: '25px', backgroundColor: '#121212', color: '#facc15', outline: 'none' }}
          />
          <button type="submit" className="send-btn" disabled={isLoading} style={{ backgroundColor: '#facc15', color: '#121212', border: 'none', borderRadius: '50%', padding: '10px', cursor: 'pointer', transition: 'background-color 0.3s ease', marginLeft: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <svg className="send-icon" style={{ width: '24px', height: '24px' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;