// import React, { useState, useEffect } from 'react';
// // Import your Firebase database connection and Realtime DB functions
// import { db } from '../../firebase/firebase';
// import { ref, onValue } from 'firebase/database';

// const PollCard = ({ poll }) => {
//   const { question, options, votes } = poll;

//   if (!votes || Object.keys(votes).length === 0) {
//     return (
//        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
//         <h3 className="text-xl font-semibold text-white mb-4">{question}</h3>
//         <p className="text-gray-400">No votes have been cast for this poll yet.</p>
//       </div>
//     );
//   }

//   const optionsArray = Object.values(options);
//   const totalVotes = Object.keys(votes).length;

//   const voteCounts = optionsArray.map((_, index) => {
//       return Object.values(votes).filter(vote => vote === index).length;
//   });

//   return (
//     <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
//       <h3 className="text-xl font-semibold text-white mb-4">{question}</h3>
//       <div className="space-y-3">
//         {optionsArray.map((optionText, index) => {
//           const percentage = totalVotes > 0 ? (voteCounts[index] / totalVotes) * 100 : 0;
//           const roundedPercentage = Math.round(percentage);

//           return (
//             <div key={index} className="flex items-center space-x-4">
//               <div className="flex-1 bg-gray-700 rounded-md overflow-hidden">
//                 <div className="relative h-10 flex items-center px-4">
//                   <div
//                     className="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-500"
//                     style={{ width: `${percentage}%` }}
//                   ></div>
//                   <span className="relative z-10 font-medium text-white">{optionText}</span>
//                 </div>
//               </div>
//               <span className="w-12 text-right font-semibold text-gray-300">{roundedPercentage}%</span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };


// const PollHistory = () => {
//   const [polls, setPolls] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // --- This now fetches data directly from your Firebase DB ---
//     const pollsRef = ref(db, 'polls/'); // Reference to the 'polls' node in your DB

//     // onValue() sets up a listener that runs every time the data changes
//     const unsubscribe = onValue(pollsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         // Convert the Firebase object into an array for easier mapping
//         const pollsArray = Object.keys(data).map(key => ({
//           id: key,
//           ...data[key],
//         }));
//         setPolls(pollsArray);
//       } else {
//         setPolls([]);
//       }
//       setLoading(false);
//     });

//     // Clean up the listener when the component unmounts to prevent memory leaks
//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <div className="text-center text-white p-10">Loading Poll History...</div>;
//   }

//   return (
//     <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-8">
//       <div className="max-w-3xl mx-auto">
//         <h2 className="text-3xl font-bold mb-8">View Poll History</h2>
//         {polls.length > 0 ? (
//           polls.map((poll) => <PollCard key={poll.id} poll={poll} />)
//         ) : (
//           <p className="text-gray-400">No poll data found in the database.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PollHistory;

import React, { useState, useEffect } from 'react';
// Make sure this path is correct for your project structure
import { db } from '../../firebase/firebase';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const PollCard = ({ poll, index }) => {
    const { question, options, votes } = poll;

    // Render a message if there are no votes
    if (!votes || Object.keys(votes).length === 0) {
        return (
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Question {index + 1}</h3>
                <div className="rounded-lg shadow-md border border-gray-200 overflow-hidden">
                    <div className="bg-slate-700 text-white p-5">
                        <p className="font-semibold text-lg">{question}</p>
                    </div>
                    <div className="bg-white p-5">
                        <p className="text-gray-500">No votes have been cast for this poll yet.</p>
                    </div>
                </div>
            </div>
        );
    }

    const optionsArray = Object.values(options);
    const totalVotes = Object.keys(votes).length;

    // Tally votes for each option
    const voteCounts = optionsArray.map((_, optionIndex) => {
        return Object.values(votes).filter(vote => vote === optionIndex).length;
    });

    return (
        <div className="mb-8">
            {/* "Question X" Title */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">Question {index + 1}</h3>

            <div className="rounded-lg shadow-md border border-gray-200">
                {/* Question Header */}
                <div className="bg-slate-700 text-white p-5 rounded-t-lg">
                    <p className="font-semibold text-lg">{question}</p>
                </div>

                {/* Options List */}
                <div className="bg-white rounded-b-lg">
                    {optionsArray.map((optionText, optionIndex) => {
                        const percentage = totalVotes > 0 ? (voteCounts[optionIndex] / totalVotes) * 100 : 0;
                        const roundedPercentage = Math.round(percentage);

                        return (
                            <div key={optionIndex} className="flex items-center space-x-4 p-4 border-t border-gray-200">
                                {/* Numbered Circle */}
                                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                                    {optionIndex + 1}
                                </div>

                                {/* Progress Bar and Text */}
                                <div className="flex-1 bg-slate-100 rounded-md h-10 overflow-hidden relative flex items-center">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-[#5767D0] transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                    <span className="relative z-10 pl-3 font-medium text-slate-800">
                                        {optionText}
                                    </span>
                                </div>

                                {/* Percentage */}
                                <span className="w-14 text-right font-bold text-slate-600">{roundedPercentage}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const PollHistory = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        const pollsRef = ref(db, 'polls/');
        const unsubscribe = onValue(pollsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const pollsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key],
                }));
                setPolls(pollsArray);
            } else {
                setPolls([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-lg text-gray-600">Loading Poll History...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-extrabold text-gray-900 mb-8">View Poll History</h2>
                {polls.length > 0 ? (
                    polls.map((poll, index) => <PollCard key={poll.id} poll={poll} index={index} />)
                ) : (
                    <p className="text-center text-gray-500 mt-10">No poll data found in the database.</p>
                )}
            </div>
            <div className="">
                <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                    Back
                </button>
            </div>
        </div>
    );
};

export default PollHistory;