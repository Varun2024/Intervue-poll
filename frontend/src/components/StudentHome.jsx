

import React from 'react';
import { FaPoll } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useParticipant } from '../context/Particiapants'; // 2. Import the context hook

function IntervuePoll() {
  // 3. Use the global state from the context instead of local state
  const { participantName, setParticipantName } = useParticipant();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!participantName.trim()) {
      alert('Please enter your name.');
      return;
    }
    // 4. Navigate to the next page without a full reload
    navigate('/student-vote');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-x-2 rounded-full bg-gradient-to-r from-[#6366F1] to-[#816FE7] px-3.5 py-1.5 text-sm font-medium text-white">
            <FaPoll />
            Intervue Poll
          </div>
        </div>

        <div className="text-center">
          <h1 className="mt-8 text-4xl tracking-tight text-gray-900">
            Let's <span className="font-bold">Get Started</span>
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            If you're a student, you'll be able to{' '}
            <strong className="font-semibold text-gray-800">
              submit your answers
            </strong>
            , participate in live polls, and see how your responses compare with
            your classmates
          </p>
        </div>

        {/* The form now properly uses onSubmit */}
        <form onSubmit={handleSubmit} className="mt-10">
          <div className="w-full max-w-lg mx-auto">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-left text-gray-800"
            >
              Enter your Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                placeholder="Your name here..."
                id="name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)} // Updates the global name
                className="block w-full rounded-md border-0 bg-gray-100 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
            <button
              type="submit"
              // Disable button if name is empty
              disabled={!participantName.trim()}
              className="w-full mt-6 rounded-full bg-gradient-to-r from-[#816FE7] to-[#6366F1] py-3 px-8 text-sm font-semibold text-white shadow-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IntervuePoll;