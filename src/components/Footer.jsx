import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client'; // ⚡ Real-time Socket Import

const Footer = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  // ⚡ Messenger Widget States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [widgetView, setWidgetView] = useState('menu'); 
  
  // States for the Email Form
  const [miniEmailData, setMiniEmailData] = useState({ name: '', email: '', message: '' });
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // States for the Chat Interface
  const [chatMessages, setChatMessages] = useState([
      { sender: 'bot', text: 'Hi there! 👋 Welcome to PhilGood Travels. How can we help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef(null);

  // ⚡ NEW: SOCKET CONNECTION STATES
  const [socket, setSocket] = useState(null);
  const [sessionId, setSessionId] = useState('');

  // ⚡ SOCKET CONNECTION LOGIC
  useEffect(() => {
      let currentSessionId = localStorage.getItem('chatSessionId');
      if (!currentSessionId) {
          currentSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('chatSessionId', currentSessionId);
      }
      setSessionId(currentSessionId);

      const newSocket = io('https://philgood-travels.onrender.com', {
          transports: ['polling', 'websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
      });
      setSocket(newSocket);

      // ⚡ CRITICAL FIX 1: Emit the join event IMMEDIATELY.
      // Socket.io automatically buffers this and sends it the moment it connects.
      newSocket.emit('join_chat', currentSessionId);

      // ⚡ CRITICAL FIX 2: Keep the .on('connect') ONLY for internet drops/reconnects.
      newSocket.on('connect', () => {
          console.log("✅ Chat Widget Connected to Room:", currentSessionId);
          newSocket.emit('join_chat', currentSessionId);
      });

      // Listen for the Admin's reply
      newSocket.on('receive_message', (message) => {
          console.log("📥 New message received in Widget:", message); // Added for your console debugging
          if (message.sender === 'admin') {
              setChatMessages((prev) => [...prev, message]);
          }
      });

      return () => newSocket.disconnect(); 
  }, []);

  // ⚡ NEW: END CHAT FUNCTION (FOR USERS)
  const handleEndChat = async () => {
    if (!window.confirm("Are you sure you want to end and clear this chat? This will remove the conversation from our records.")) return;

    try {
        // 1. Delete the chat from the database (removes it from Admin Dashboard)
        await axios.delete(`https://philgood-travels.onrender.com/api/admin/chats/${sessionId}`);
    } catch (error) {
        console.error("Error ending chat on server:", error);
    }

    // 2. Wipe the user's browser memory
    localStorage.removeItem('chatSessionId');
    
    // 3. Clear the messages on their screen (keep only the bot greeting)
    setChatMessages([{ sender: 'bot', text: 'Hi there! 👋 Welcome to PhilGood Travels. How can we help you today?' }]);
    
    // 4. Generate a brand new, empty session identity
    const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatSessionId', newSessionId);
    setSessionId(newSessionId);
    
    // 5. Connect the socket to the new room 
    if (socket) {
        socket.emit('join_chat', newSessionId);
    }

    // 6. Send them back to the main menu
    setWidgetView('menu');
  };

  // Auto-scroll chat to bottom
  useEffect(() => {
      if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
  }, [chatMessages, widgetView]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) setWidgetView('menu'); 
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus({ loading: true, message: '', type: '' });
    try {
        const response = await axios.post('https://philgood-travels.onrender.com/api/contact/subscribe', { email });
        setStatus({ loading: false, message: response.data.message, type: 'success' });
        setEmail(''); 
        setTimeout(() => setStatus({ loading: false, message: '', type: '' }), 3000);
    } catch (error) {
        const errorMsg = error.response?.data?.error || "Failed to subscribe.";
        setStatus({ loading: false, message: errorMsg, type: 'danger' });
        setTimeout(() => setStatus({ loading: false, message: '', type: '' }), 3000);
    }
  };

  const handleSendMiniEmail = async (e) => {
      e.preventDefault();
      setIsSendingEmail(true);
      try {
          await axios.post('https://philgood-travels.onrender.com/api/contact/send', {
              ...miniEmailData,
              subject: 'New Message from Website Widget'
          });
          alert("Message sent! We'll get back to you soon.");
          setWidgetView('menu');
          setMiniEmailData({ name: '', email: '', message: '' });
      } catch (error) {
          alert("Failed to send message.");
      } finally {
          setIsSendingEmail(false);
      }
  };

  const handleSendChat = () => {
      if (!chatInput.trim() || !socket) return;

      const messageData = {
          sessionId: sessionId,
          sender: 'user',
          text: chatInput
      };

      // Emit the message to the server
      socket.emit('send_message', messageData);

      // Locally add the user's message so it appears instantly
      setChatMessages(prev => [...prev, messageData]);
      setChatInput(''); 
  };

  return (
    <>
      <footer>
          <div className="waves-container">
              <svg className="waves" xmlns="http://www.w3.org/2000/svg" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
                  <defs>
                      <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                  </defs>
                  <g className="parallax">
                      <use xlinkHref="#gentle-wave" x="48" y="0" />
                      <use xlinkHref="#gentle-wave" x="48" y="3" />
                      <use xlinkHref="#gentle-wave" x="48" y="5" />
                      <use xlinkHref="#gentle-wave" x="48" y="7" />
                  </g>
              </svg>
          </div>

          <div className="container">
              <div className="row gy-5">
                  <div className="col-lg-4 col-md-6">
                      <Link className="footer-brand" to="/">
                          <img src="https://i.postimg.cc/CLfdcctP/Untitled-design-(3).png" alt="PhilGood Logo" className="footer-logo-img" />
                      </Link>
                      <p className="mb-4 text-white-50" style={{ maxWidth: '300px' }}>
                          Your gateway to unforgettable Philippine adventures. Discover pristine beaches, majestic mountains, and vibrant culture.
                      </p>
                      <div className="social-links">
                          <a href="https://www.facebook.com/share/18YdGGJNhM/" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa-brands fa-facebook-f"></i></a>
                          <a href="https://www.instagram.com/philgoodtravels?igsh=bWQ3Z2s4bXY0Mzl6" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa-brands fa-instagram"></i></a>
                          <a href="https://x.com/techtacoder" target="_blank" rel="noopener noreferrer" className="social-btn"><i className="fa-brands fa-x-twitter"></i></a>
                      </div>
                  </div>
                  <div className="col-lg-2 col-md-6">
                      <h5 className="footer-heading text-white">Quick Links</h5>
<ul className="footer-links">
    <li><Link to="/destinations">Destinations</Link></li>
    <li><Link to="/tours">Tour Packages</Link></li>
    <li><Link to="/gallery">Gallery</Link></li>
    <li><Link to="/booking">Book Now</Link></li>
    {/* ⚡ NEW LINKS ADDED HERE ⚡ */}
    <li><Link to="/faq">FAQ</Link></li>
    <li><Link to="/terms">Terms & Conditions</Link></li>
</ul>
                  </div>
                  <div className="col-lg-3 col-md-6">
                      <h5 className="footer-heading text-white">Contact</h5>
                      <ul className="footer-links contact-list text-white-50">
                          <li><i className="fa-solid fa-location-dot contact-icon text-accent me-2"></i> 123 Travel Street, Manila</li>
                          <li><i className="fa-solid fa-phone contact-icon text-accent me-2"></i> +63 123 456 7890</li>
                          <li><i className="fa-solid fa-envelope contact-icon text-accent me-2"></i> hello@philgoodtravels.com</li>
                      </ul>
                  </div>
                  <div className="col-lg-3 col-md-6">
                      <h5 className="footer-heading text-white">Newsletter</h5>
                      <p className="mb-3 text-white-50">Subscribe for exclusive deals!</p>
                      <form onSubmit={handleSubscribe} className="position-relative">
                          <input 
                              type="email" 
                              className="footer-input" 
                              placeholder="Your email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                          />
                          <button type="submit" className="footer-subscribe-btn" disabled={status.loading}>
                              {status.loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
                          </button>
                          {status.message && (
                              <div className={`text-${status.type} fw-bold small mt-2`}>
                                  {status.type === 'success' ? <i className="fa-solid fa-check me-1"></i> : <i className="fa-solid fa-circle-exclamation me-1"></i>}
                                  {status.message}
                              </div>
                          )}
                      </form>
                  </div>
              </div>
              <div className="text-center mt-5 pt-4 border-top border-white border-opacity-25">
                  <small className="text-white-50">&copy; 2024 PhilGood Travels. All rights reserved.</small>
              </div>
          </div>
      </footer>

      {/* Messenger Widget */}
      <div className="chat-widget-container">
          <div className={`chat-popup ${isChatOpen ? 'show' : ''}`} style={{ width: '320px', bottom: '85px', borderRadius: '12px', overflow: 'hidden' }}>
              <div className="chat-popup-header d-flex justify-content-between align-items-center" style={{ padding: '15px', backgroundColor: 'var(--primary-dark)', color: 'white' }}>
                  <div className="d-flex align-items-center gap-2">
                      {widgetView !== 'menu' && (
                          <i className="fa-solid fa-arrow-left" style={{ cursor: 'pointer', fontSize: '1.1rem' }} onClick={() => setWidgetView('menu')}></i>
                      )}
                      <h6 className="m-0 fw-bold font-montserrat">
                          {widgetView === 'menu' ? 'Need Help?' : widgetView === 'chat' ? 'Live Chat' : 'Send an Email'}
                      </h6>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                      {/* ⚡ TRASH BUTTON FOR USERS (Visible only in chat view) */}
                      {widgetView === 'chat' && (
                          <i 
                            className="fa-solid fa-trash-can opacity-75" 
                            style={{ cursor: 'pointer', fontSize: '1rem' }} 
                            onClick={handleEndChat}
                            title="End Chat"
                          ></i>
                      )}
                      <i className="fa-solid fa-xmark" style={{ cursor: 'pointer', fontSize: '1.2rem' }} onClick={() => setIsChatOpen(false)}></i>
                  </div>
              </div>

              <div className="chat-popup-body" style={{ height: '340px', backgroundColor: 'var(--card-bg)', position: 'relative' }}>
                  {widgetView === 'menu' && (
                      <div className="d-flex flex-column justify-content-center h-100 p-3 gap-3">
                          <p className="text-center text-grey small mb-2">How would you like to reach us?</p>
                          <button className="btn btn-proceed fw-bold py-3 shadow-sm" onClick={() => setWidgetView('chat')}>
                              <i className="fa-solid fa-comments me-2 fs-5"></i> Start a Chat
                          </button>
                          <button className="btn btn-outline-custom fw-bold py-3 shadow-sm" onClick={() => setWidgetView('email')}>
                              <i className="fa-solid fa-envelope me-2 fs-5"></i> Send an Email
                          </button>
                      </div>
                  )}

                  {widgetView === 'email' && (
                      <form onSubmit={handleSendMiniEmail} className="d-flex flex-column h-100 p-3">
                          <p className="text-grey small mb-3">Leave us a message and we will reply to your email shortly.</p>
                          <input type="text" className="form-control form-control-sm mb-2" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--dark-navy)' }} placeholder="Your Name" required value={miniEmailData.name} onChange={e => setMiniEmailData({...miniEmailData, name: e.target.value})} />
                          <input type="email" className="form-control form-control-sm mb-2" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--dark-navy)' }} placeholder="Your Email Address" required value={miniEmailData.email} onChange={e => setMiniEmailData({...miniEmailData, email: e.target.value})} />
                          <textarea className="form-control form-control-sm flex-grow-1 mb-3" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--dark-navy)', resize: 'none' }} placeholder="How can we help?" required value={miniEmailData.message} onChange={e => setMiniEmailData({...miniEmailData, message: e.target.value})}></textarea>
                          <button type="submit" className="btn btn-proceed fw-bold w-100" disabled={isSendingEmail}>
                              {isSendingEmail ? 'Sending...' : 'Send Message'}
                          </button>
                      </form>
                  )}

                  {widgetView === 'chat' && (
                      <div className="d-flex flex-column h-100 p-2" style={{ backgroundColor: 'rgba(0, 180, 216, 0.05)' }}>
                          <div className="flex-grow-1 overflow-auto d-flex flex-column gap-2 p-2" ref={chatScrollRef} style={{ scrollBehavior: 'smooth' }}>
                              {chatMessages.map((msg, i) => (
                                  <div key={i} className={`p-2 rounded-3 shadow-sm ${msg.sender === 'bot' || msg.sender === 'admin' ? 'bg-white text-dark align-self-start border' : 'text-white align-self-end'}`} style={{ maxWidth: '85%', fontSize: '0.85rem', backgroundColor: msg.sender === 'user' ? 'var(--primary-color)' : '' }}>
                                      {msg.text}
                                  </div>
                              ))}
                          </div>
                          <div className="d-flex gap-2 mt-2 border-top pt-2">
                              <input type="text" className="form-control form-control-sm" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--dark-navy)', borderRadius: '20px' }} placeholder="Type a message..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendChat()} />
                              <button className="btn btn-sm btn-proceed rounded-circle d-flex align-items-center justify-content-center" style={{ width: '35px', height: '35px', flexShrink: 0 }} onClick={handleSendChat}>
                                  <i className="fa-solid fa-paper-plane"></i>
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>
          <button className="chat-btn-main" onClick={toggleChat}>
              <i className={`fa-solid ${isChatOpen ? 'fa-xmark' : 'fa-comment-dots'}`}></i>
          </button>
      </div>
    </>
  );
};

export default Footer;