


import React, { useState, useEffect } from 'react';
import { FaHistory, FaComment, FaPlus } from 'react-icons/fa';
import io from 'socket.io-client';

// Establish the socket connection
const socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling']
});

export default function LivePollResults() {
    const [poll, setPoll] = useState(null); // Use state to manage poll data

    useEffect(() => {
        // Listen for new poll data from the server
        socket.on('pollData', (newPoll) => {
            console.log('Received new poll data:', newPoll);
            const initialOptions = newPoll.options.map(optionText => ({
                text: optionText,
                percentage: 0,
            }));
            setPoll({
                question: newPoll.question,
                options: initialOptions,
            });
        });

        // Listen for updated poll results
        socket.on('updateResults', (updatedPoll) => {
            const totalVotes = Object.values(updatedPoll.votes).reduce((sum, count) => sum + count, 0);

            setPoll(prevPoll => {
                // Handle case where poll is not yet set
                if (!prevPoll) {
                    return null;
                }

                return {
                    ...prevPoll,
                    options: prevPoll.options.map(option => {
                        const votes = updatedPoll.votes[option.text] || 0;
                        const percentage = totalVotes === 0 ? 0 : (votes / totalVotes) * 100;
                        return {
                            ...option,
                            percentage: percentage,
                        };
                    }),
                };
            });
        });



        // Clean up the event listeners when the component unmounts
        return () => {
            socket.off('pollData');
            socket.off('updateResults');
        };
    }, []);

    // Display a loading message if no poll is active
    if (!poll) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
                <p className="text-xl text-gray-500">Waiting for a new poll to be created...</p>
            </div>
        );
    }
    const handleAddNewQuestion = () => {
        window.location.href = '/create-poll';
    };
    // Once a poll is active, display the results
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            {/* Header with View Poll History button */}
            <div className="absolute right-4 top-4 ">
                <button className="flex items-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-2 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105">
                    <FaHistory className="mr-2" />
                    View Poll history
                </button>
            </div>

            {/* Main Content Area */}
            <div className="w-4/6 mb-5">
                <h2 className="mb-4 text-left text-2xl font-semibold text-gray-900 md:text-3xl">
                    Question
                </h2>
                <div className="rounded-xl bg-white border-1 border-[#6E6E6E]/20">
                    {/* Question Card */}
                    <div className="mb-6 rounded-t-lg bg-[#6E6E6E] p-4 text-white">
                        <p className="text-xl font-medium">{poll.question}</p>
                    </div>

                    {/* Poll Options and Results */}
                    <div className="space-y-4 p-4">
                        {poll.options.map((option, index) => (
                            <div
                                key={index}
                                className={`relative rounded-lg p-4 transition-all duration-300 ${option.isCorrect ? 'bg-green-50' : 'bg-gray-100'
                                    }`}
                            >
                                {/* Progress Bar */}
                                <div
                                    className="absolute left-0 top-0 h-full rounded-lg bg-[#5767D0] transition-all duration-700 ease-out"
                                    style={{ width: `${option.percentage}%` }}
                                ></div>

                                {/* Content */}
                                <div className="relative flex items-center justify-between ">
                                    <div className="flex items-center space-x-4">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm text-[#6E6E6E]">
                                            {index + 1}
                                        </span>
                                        <span className={`text-lg ${ poll ? 'text-white' : 'text-black'}`}>{option.text}</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-800">{option.percentage.toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="w-4/6 mb-10 flex justify-end">
                <button
                    onClick={handleAddNewQuestion}
                    className="flex items-center rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-2 text-lg text-white shadow-lg transition-transform hover:scale-105"
                >
                <FaPlus size={10} className="mr-2" />
                Add New Question
            </button>
                        </div>
            
        </div>
    );
}