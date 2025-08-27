import React from 'react'
import { FaComment } from 'react-icons/fa'
import ParticipantsView from './ParticiapntsView';

const ChatIcon = () => {
    const [clicked, setClicked] = React.useState(false);

    return (
        <div>
            {/* Floating Chat Icon */}
            {clicked &&
                <div className={`absolute bottom-40 right-6 transform transition-all duration-300 ease-in-out
          ${clicked ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                    <ParticipantsView />
                </div>}
            <div className="fixed bottom-25 right-6">
                <button
                    onClick={() => setClicked(!clicked)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg transition-transform hover:scale-110">
                    <FaComment size={24} />
                </button>
            </div>
        </div>
    )
}

export default ChatIcon