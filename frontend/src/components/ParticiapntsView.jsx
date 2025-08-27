// import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';
// import { useParticipant } from '../context/Particiapants';
// // Connect to the backend server
// const socket = io('http://localhost:3000');

// const ParticipantsView = () => {
//     const [participants, setParticipants] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [activeTab, setActiveTab] = useState('Participants');
//     const { participantName } = useParticipant();
//     //   useEffect(() => {
//     //     const name = prompt("Please enter your name to join:");
//     //     if (name) {
//     //       socket.emit('joinRoom', { name });
//     //     }

//     //     // --- Socket Event Listeners ---
//     //     socket.on('myInfo', (userInfo) => {
//     //       setCurrentUser(userInfo);
//     //     });

//     //     socket.on('updateParticipantList', (participantList) => {
//     //       setParticipants(participantList);
//     //     });

//     //     // Clean up listeners
//     //     return () => {
//     //       socket.off('myInfo');
//     //       socket.off('updateParticipantList');
//     //     };
//     //   }, []);

//     useEffect(() => {
//         // 3. Only join the room if the name has been set from the welcome page
//         if (participantName) {
//             socket.emit('joinRoom', { name: participantName });
//         }

//         // --- Socket Event Listeners ---
//         socket.on('myInfo', (userInfo) => {
//             console.log('My info received:', userInfo);
//             setCurrentUser(userInfo);
//         });

//         socket.on('updateParticipantList', (participantList) => {
//             setParticipants(participantList);
//         });

//         // Clean up listeners when the component unmounts
//         return () => {
//             socket.off('myInfo');
//             socket.off('updateParticipantList');
//         };
//         // 4. Re-run this effect if the participantName changes
//     }, [participantName]);

//     const handleKickOut = (participantToKick) => {
//         if (window.confirm(`Are you sure you want to kick out ${participantToKick.name}?`)) {
//             socket.emit('kickUser', participantToKick.id);
//         }
//     };

//     // Helper for dynamic tab styling
//     const getTabClass = (tabName) => {
//         return `relative flex-1 py-4 px-2 text-center text-sm font-semibold cursor-pointer transition-colors duration-200 focus:outline-none ${activeTab === tabName
//                 ? 'text-purple-600'
//                 : 'text-gray-500 hover:text-gray-800'
//             }`;
//     };

//     return (
//         // Main container
//         <div className="w-96 bg-white rounded-xl shadow-lg border border-gray-200 font-sans overflow-hidden">
//             {/* Tabs */}
//             <div className="flex border-b border-gray-200">
//                 <button className={getTabClass('Chat')} onClick={() => setActiveTab('Chat')}>
//                     Chat
//                     {activeTab === 'Chat' && <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-purple-600 rounded-t-full"></span>}
//                 </button>
//                 <button className={getTabClass('Participants')} onClick={() => setActiveTab('Participants')}>
//                     Participants
//                     {activeTab === 'Participants' && <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-purple-600 rounded-t-full"></span>}
//                 </button>
//             </div>

//             {/* List container */}
//             <div className="px-6 pb-4">
//                 {/* List Header */}
//                 <div className="flex justify-between py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     <span>Name</span>
//                     <span>Action</span>
//                 </div>

//                 {/* List Body */}
//                 <div className="divide-y divide-gray-100">
//                     {participants.map((participant) => (
//                         <div className="flex justify-between items-center py-3" key={participant.id}>
//                             {/* Participant Name */}
//                             <span className="text-gray-800 font-medium text-base">
//                                 {participant.name}
//                                 {participant.id === currentUser?.id && <span className="text-gray-400 font-normal text-sm ml-2">(You)</span>}
//                             </span>

//                             {/* Action Button */}
//                             <div>
//                                 {currentUser?.role === 'teacher' && participant.role === 'student' && (
//                                     <button
//                                         onClick={() => handleKickOut(participant)}
//                                         className="bg-transparent border-none text-blue-500 font-semibold text-sm p-0 hover:underline focus:outline-none"
//                                     >
//                                         Kick out
//                                     </button>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ParticipantsView;

import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


const socket = io('http://localhost:3000');
import { useParticipant } from '../context/Particiapants';



// A new, dedicated component for the chat interface
const ChatView = ({ messages, currentUser }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null); // Ref to help auto-scroll

    // Function to handle sending a message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket) {
            socket.emit('sendMessage', newMessage.trim());
            setNewMessage(''); // Clear input after sending
        }
    };

    // Auto-scroll to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex flex-col h-[400px]"> {/* Fixed height for the chat container */}
            {/* Message display area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                    const isCurrentUser = msg.senderId === currentUser?.id;
                    return (
                        <div
                            key={index}
                            className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                        >
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${isCurrentUser ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                {!isCurrentUser && (
                                    <p className="text-xs font-bold text-purple-700 mb-1">{msg.senderName}</p>
                                )}
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    );
                })}
                {/* Empty div to which we can scroll */}
                <div ref={messagesEndRef} />
            </div>

            {/* Message input form */}
            <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-purple-300"
                        disabled={!newMessage.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};


const ParticipantsView = () => {
    const [participants, setParticipants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeTab, setActiveTab] = useState('Participants');
    const [messages, setMessages] = useState([]); // State for chat messages

    const { participantName } = useParticipant();

    useEffect(() => {
        // Only join the room if the name has been set from the welcome page
        if (participantName) {
            socket.emit('joinRoom', { name: participantName });
        }

        // --- Socket Event Listeners ---
        const handleMyInfo = (userInfo) => {
            console.log('My info received:', userInfo);
            setCurrentUser(userInfo);
        };

        const handleUpdateList = (participantList) => {
            setParticipants(participantList);
        };

        // Listener for incoming chat messages
        const handleNewMessage = (messageData) => {
            setMessages((prevMessages) => [...prevMessages, messageData]);
        };
        
        // Listener for chat errors
        const handleChatError = (errorMessage) => {
            console.error("Chat Error:", errorMessage);
            // Here you could show a toast or an alert to the user
        };

        socket.on('myInfo', handleMyInfo);
        socket.on('updateParticipantList', handleUpdateList);
        socket.on('newMessage', handleNewMessage);
        socket.on('chatError', handleChatError);

        // Clean up listeners when the component unmounts
        return () => {
            socket.off('myInfo', handleMyInfo);
            socket.off('updateParticipantList', handleUpdateList);
            socket.off('newMessage', handleNewMessage);
            socket.off('chatError', handleChatError);
        };
    }, [participantName]);

    const handleKickOut = (participantToKick) => {
        // Replaced window.confirm with a less intrusive confirmation
        if (confirm(`Are you sure you want to kick out ${participantToKick.name}?`)) {
            socket.emit('kickUser', participantToKick.id);
        }
    };

    // Helper for dynamic tab styling
    const getTabClass = (tabName) => {
        return `relative flex-1 py-4 px-2 text-center text-sm font-semibold cursor-pointer transition-colors duration-200 focus:outline-none ${activeTab === tabName
                ? 'text-purple-600'
                : 'text-gray-500 hover:text-gray-800'
            }`;
    };

    return (
        // Main container
        <div className="w-96 relative x-50 bg-white rounded-xl shadow-lg border border-gray-200 font-sans flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button className={getTabClass('Chat')} onClick={() => setActiveTab('Chat')}>
                    Chat
                    {activeTab === 'Chat' && <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-purple-600 rounded-t-full"></span>}
                </button>
                <button className={getTabClass('Participants')} onClick={() => setActiveTab('Participants')}>
                    Participants
                    {activeTab === 'Participants' && <span className="absolute bottom-[-1px] left-0 w-full h-1 bg-purple-600 rounded-t-full"></span>}
                </button>
            </div>

            {/* Conditional Content Area */}
            <div className="flex-1">
                {activeTab === 'Chat' ? (
                    <ChatView messages={messages} currentUser={currentUser} />
                ) : (
                    <div className="px-6 pb-4">
                        {/* List Header */}
                        <div className="flex justify-between py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <span>Name ({participants.length})</span>
                            <span>Action</span>
                        </div>
                        {/* List Body */}
                        <div className="divide-y divide-gray-100">
                            {participants.map((participant) => (
                                <div className="flex justify-between items-center py-3" key={participant.id}>
                                    <span className="text-gray-800 font-medium text-base">
                                        {participant.name}
                                        {participant.id === currentUser?.id && <span className="text-gray-400 font-normal text-sm ml-2">(You)</span>}
                                    </span>
                                    <div>
                                        {currentUser?.role === 'teacher' && participant.id !== currentUser?.id && (
                                            <button
                                                onClick={() => handleKickOut(participant)}
                                                className="bg-transparent border-none text-red-500 font-semibold text-sm p-0 hover:underline focus:outline-none"
                                            >
                                                Kick
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantsView;
