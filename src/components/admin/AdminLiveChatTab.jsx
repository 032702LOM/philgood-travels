import React from 'react';

const AdminLiveChatTab = ({
    activeChats,
    selectedChat,
    setSelectedChat,
    adminChatInput,
    setAdminChatInput,
    handleAdminReply,
    handleDeleteChat
}) => {
    return (
        <div className="row g-0 fade-in" style={{ height: '600px', backgroundColor: '#fff' }}>
            {/* Left Sidebar: List of Active Users */}
            <div className="col-md-4 border-end overflow-auto p-3 h-100" style={{ backgroundColor: '#f8f9fa' }}>
                <h6 className="fw-bold text-navy mb-3">Customer Inquiries</h6>
                {activeChats.length === 0 ? (
                    <div className="text-center mt-5 opacity-50">
                        <i className="fa-solid fa-cloud mb-2" style={{ fontSize: '2rem' }}></i>
                        <p className="small">No active chats found.</p>
                    </div>
                ) : (
                    activeChats.map(chat => (
                        <div key={chat._id} 
                            onClick={() => setSelectedChat(chat)}
                            className={`p-3 mb-2 rounded-3 border cursor-pointer shadow-sm ${selectedChat?.sessionId === chat.sessionId ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="fw-bold">Visitor {chat.sessionId.substring(8, 13)}</small>
                                <small className="opacity-75" style={{ fontSize: '0.7rem' }}>
                                    {new Date(chat.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </small>
                            </div>
                            <div className="small text-truncate mt-1" style={{ opacity: 0.8 }}>
                                {chat.messages[chat.messages.length - 1]?.text}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Right Side: The Chat Conversation */}
            <div className="col-md-8 d-flex flex-column p-0 h-100">
                {selectedChat ? (
                    <>
                        <div className="p-3 border-bottom bg-white fw-bold text-navy d-flex align-items-center">
                            <div className="bg-success rounded-circle me-2" style={{ width: '10px', height: '10px' }}></div>
                            Session: {selectedChat.sessionId}
                        </div>
                        <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column gap-3" style={{ backgroundColor: '#f0f2f5' }}>
                            {selectedChat.messages.map((m, i) => (
                                <div key={i} className={`p-3 rounded-4 shadow-sm ${m.sender === 'admin' ? 'bg-primary text-white align-self-end' : 'bg-white text-dark align-self-start border'}`} style={{ maxWidth: '75%', fontSize: '0.9rem' }}>
                                    {m.text}
                                </div>
                            ))}
                        </div>
                        <div className="p-3 bg-white border-top d-flex gap-2">
                            <input 
                                type="text" 
                                className="form-control border-0 bg-light" 
                                placeholder="Type a message..." 
                                value={adminChatInput} 
                                onChange={e => setAdminChatInput(e.target.value)} 
                                onKeyDown={e => e.key === 'Enter' && handleAdminReply()} 
                            />
                            <button className="btn btn-proceed px-4 fw-bold" onClick={handleAdminReply} disabled={!adminChatInput.trim()}>
                                Send
                            </button>
                            <button className="btn btn-outline-danger px-3 fw-bold" onClick={handleDeleteChat} title="End & Delete Chat">
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center text-grey opacity-50">
                        <i className="fa-solid fa-comments mb-3" style={{ fontSize: '4rem' }}></i>
                        <p className="fw-bold">Select a conversation to start helping customers.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLiveChatTab;