import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Make sure this URL matches your backend server address
const socket = io('https://intervue-poll-b631.onrender.com',{
    transports: ['websocket', 'polling']
});

// A simple chat bubble icon component (no changes needed here)
const ChatIcon = () => (
    <div className="fixed bottom-8 right-8 grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-violet-600 text-white shadow-lg transition-transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
        </svg>
    </div>
);

function Vote() {
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [hasVoted, setHasVoted] = useState(false);
    const [results, setResults] = useState(null);
    // ✨ NEW: State to manage the countdown timer
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        // --- SOCKET.IO EVENT LISTENERS ---
        socket.on('pollData', (data) => {
            console.log('Poll data received:', data);
            setPoll(data);
            console.log('Timer set to:', data.timer);
            setResults(null);
            setSelectedOption('');
            setHasVoted(false);
            // ✨ NEW: Initialize the timer when a new poll arrives
            setTimeLeft(data.timer);
        });

        socket.on('updateResults', (data) => {
            console.log('Results updated:', data);
            setResults(data.votes);
        });

        socket.on('voteError', (errorMessage) => {
            alert(errorMessage);
        });

        return () => {
            socket.off('pollData');
            socket.off('updateResults');
            socket.off('voteError');
        };
    }, []);

    // ✨ NEW: useEffect to handle the countdown logic
    useEffect(() => {
        // If there's no time left or no poll, don't do anything
        if (!timeLeft || !poll) return;

        // Set up an interval to decrease the timer every second
        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        // When the timer hits 0, treat it as if the user has voted to show results
        if (timeLeft === 0) {
            setHasVoted(true);
        }

        // Clean up the interval when the component unmounts or timeLeft changes
        return () => clearInterval(intervalId);
    }, [timeLeft, poll]);


    const handleVoteSubmit = (e) => {
        e.preventDefault();
        if (!selectedOption) {
            alert('Please select an option before submitting.');
            return;
        }
        socket.emit('submitVote', selectedOption);
        setHasVoted(true);
    };

    // If no poll is active, render the waiting/loader screen
    if (!poll) {
        return (
            <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-slate-50 p-4 text-center">
                <span className="rounded-full bg-violet-600 px-4 py-2 font-medium text-white">
                    ✨ Intervue Poll
                </span>
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"></div>
                <h1 className="text-2xl font-semibold text-slate-700">
                    Wait for the teacher to ask questions..
                </h1>
            </main>
        );
    }

    const totalVotes = results ? Object.values(results).reduce((sum, count) => sum + count, 0) : 0;
    
    // ✨ NEW: Determine if the voting period is over (by voting or timer)
    const isPollFinished = hasVoted || timeLeft === 0;

    return (
        <main className="flex min-h-screen w-full items-center justify-center p-4 ">
            <div className="w-full max-w-3xl bg-white ">
                <div className="mb-2 flex gap-10 items-center">
                    <h2 className="text-lg font-medium text-slate-600">Question 1</h2>
                    {/* ✨ UPDATED: Display the live timeLeft state */}
                    <span className={`font-medium ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>⏳ {timeLeft}s left</span>
                </div>

                <form onSubmit={handleVoteSubmit} className="rounded-xl border-1 border-[#4F0DCE] ">
                    {/* ✨ UPDATED: Disable the fieldset when poll is finished */}
                    <fieldset disabled={isPollFinished} className="group">
                        <legend className="w-full rounded-t-xl bg-slate-800 p-4 text-center text-xl font-bold text-white">
                            {poll.question}
                        </legend>
                        <div className="flex flex-col gap-3 p-4">
                            {poll.options.map((option, index) => {
                                const voteCount = results ? results[option] : 0;
                                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                                
                                // ✨ NEW: Determine styling based on vote status and correctness
                                const isSelected = selectedOption === option;
                                const isCorrect = poll.correctOption === option;
                                
                                let optionStyle = 'border-slate-300 group-disabled:cursor-not-allowed';
                                if (isPollFinished) {
                                    if (isCorrect) {
                                        // Style for the correct answer
                                        optionStyle = 'border-green-500 bg-green-50 text-green-800 font-semibold';
                                    } else if (isSelected && !isCorrect) {
                                        // Style for a user's incorrect selection
                                        optionStyle = 'border-red-400 bg-red-50 text-red-700 opacity-80';
                                    } else {
                                        // Style for other non-selected, incorrect options
                                        optionStyle = 'border-slate-200 bg-slate-50 opacity-60';
                                    }
                                } else if (isSelected) {
                                    // Style for the selected option before voting
                                    optionStyle = 'border-violet-600 bg-violet-50';
                                }

                                return (
                                    <div
                                        key={index}
                                        onClick={() => !isPollFinished && setSelectedOption(option)}
                                        // ✨ UPDATED: Apply dynamic classes
                                        className={`flex cursor-pointer items-center justify-between rounded-lg border-2 p-3 transition-all ${optionStyle} ${!isPollFinished ? 'hover:border-violet-500' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold 
                                                ${isSelected || (isPollFinished && isCorrect) ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                                {index + 1}
                                            </span>
                                            <span className="font-medium">
                                                {option}
                                                {/* ✨ NEW: Add an indicator for the correct answer */}
                                                {isPollFinished && isCorrect && <span className="ml-2 text-green-600">✓ Correct</span>}
                                            </span>
                                        </div>

                                        {isPollFinished && (
                                            <div className="flex w-1/2 items-center gap-3">
                                                <div className="h-2 flex-grow rounded-full bg-slate-200">
                                                    <div
                                                        className={`h-full rounded-full ${isCorrect ? 'bg-green-500' : 'bg-indigo-500'} transition-all duration-500`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div> 
                                                <span className="w-12 text-right font-semibold text-violet-700">
                                                    {percentage.toFixed(0)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </fieldset>

                    <div className="relative p-6 pt-10 flex flex-col justify-end">
                        {/* ✨ UPDATED: Hide the button once the poll is finished */}
                        {!isPollFinished && (
                            <button
                                type="submit"
                                disabled={!selectedOption}
                                className="w-[50%] rounded-lg bg-violet-600 p-3 text-lg font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-slate-400"
                            >
                                Submit
                            </button>
                        )}
                         {isPollFinished && (
                             <p className="text-center font-semibold text-slate-600">Voting has ended. Here are the results.</p>
                         )}
                    </div>
                </form>
            </div>
            
        </main>
    );
}

export default Vote;