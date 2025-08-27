// import { useState } from 'react';
// import { FaPoll, FaPlus } from 'react-icons/fa';
// import io from 'socket.io-client';
// import { TbTriangleInvertedFilled } from "react-icons/tb";

// // Establish the socket connection outside the component
// const socket = io('http://localhost:3000', { transports: ['websocket'] });

// export default function CreatePollPage() {
//     const [question, setQuestion] = useState('');
//     const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
//     const [timer, setTimer] = useState(60); // Timer state
//     const timerOptions = [15, 30, 45, 60, 90, 120];

//     const handleAddOption = () => {
//         // Correctly adding a new option object
//         setOptions([...options, { text: '', isCorrect: false }]);
//     };

//     const handleOptionChange = (index, value) => {
//         const newOptions = [...options];
//         newOptions[index].text = value;
//         setOptions(newOptions);
//     };

//     const handleCorrectChange = (index) => {
//         const newOptions = options.map((option, i) => ({
//             ...option,
//             isCorrect: i === index
//         }));
//         setOptions(newOptions);
//     };

//     const handleCreatePoll = () => {
//         // Find the correct option text
//         const correctOption = options.find(option => option.isCorrect)?.text;

//         // Check if a correct option is selected
//         if (!correctOption) {
//             alert('Please select a correct answer.');
//             return;
//         }

//         // Check if the question and all options are not empty
//         if (question.trim() && options.every(option => option.text.trim())) {
//             const pollData = {
//                 question,
//                 options: options.map(opt => opt.text),
//                 correctOption, // Send the text of the correct option
//                 timer: Number(timer) // ✨ ADDED: Include the timer in the emitted data
//             };

//             // Emit the 'createPoll' event to the server
//             socket.emit('createPoll', pollData);
//             console.log('Poll created:', pollData);

//             // Navigate to the live polls page after emitting the event
//             window.location.href = '/live-polls';
//         } else {
//             alert('Please enter a question and fill out all options.');
//         }
//     };


//     // ... The rest of your JSX remains exactly the same
//     return (
//         <div className="flex w-[90vw] flex-col min-h-screen mx-30 items-start justify-center p-4">
//             <div className="mb-4 inline-flex items-center rounded-full  bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white">
//                 <FaPoll className="mr-2 h-4 w-4" />
//                 Intervue Poll
//             </div>

//             <h1 className="mb-2 text-3xl  text-gray-800">Let's <span className='font-bold'>Get Started</span></h1>
//             <p className="mb-8 text-gray-500">
//                 You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
//             </p>

//             <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
//                 {/* Question Input */}
//                 <div>
//                     <div className="flex items-center justify-between mb-4">
//                         <label htmlFor="question" className=" block text-xl font-medium text-gray-900">
//                             Enter your question
//                         </label>
//                         <div className="relative inline-block w-40">
//                             <select
//                                 value={timer}
//                                 onChange={(e) => setTimer(e.target.value)}
//                                 className=" appearance-none rounded-lg border-none bg-[#6e6e6e]/10 px-3 py-2 pr-12 text-center font-medium text-lg text-gray-900 focus:outline-none "
//                             >
//                                 {timerOptions.map((time) => (
//                                     <option className='transition-all duration-300 ease-in-out' key={time} value={time}>
//                                         {time} seconds
//                                     </option>
//                                 ))}
//                             </select>
//                             <div className="cursor-pointer absolute transition-all duration-200 inset-y-0 right-0 flex items-center justify-center px-2 text-[#7765DA]">
//                                 <TbTriangleInvertedFilled />
//                             </div>
//                         </div>

//                     </div>
//                     <div className="relative">
//                         <textarea
//                             id="question"
//                             rows="4"
//                             className="w-full border-none bg-[#6e6e6e]/10 p-3 pr-20 text-gray-900 focus:outline-none "
//                             placeholder="Type your question here..."
//                             value={question}
//                             onChange={(e) => setQuestion(e.target.value)}
//                             maxLength={100}
//                             style={{ resize: 'none' }}
//                         />
//                         <span className="absolute bottom-3 right-3 text-sm text-gray-400">
//                             {question.length}/100
//                         </span>
//                     </div>

//                 </div>
//             </div>

//             {/* Options Section */}
//             <div className="mt-8 w-3/6">
//                 <div className="flex justify-between">
//                     <h2 className="mb-4 text-xl font-semibold text-gray-700">Edit Options</h2>
//                     <h2 className=" mb-4 text-xl font-semibold text-gray-700">Is it Correct?</h2>
//                 </div>
//                 <div className="space-y-4">
//                     {options.map((option, index) => (
//                         <div key={index} className="flex items-center space-x-4">
//                             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7765DA] text-white">
//                                 {index + 1}
//                             </span>
//                             <input
//                                 type="text"
//                                 className="flex-1 rounded-lg border-none bg-[#6e6e6e]/10 p-3 text-gray-900 focus:outline-none "
//                                 placeholder={`Option ${index + 1}`}
//                                 value={option.text}
//                                 onChange={(e) => handleOptionChange(index, e.target.value)}
//                             />
//                             {/* Simplified Radio Button Logic */}
//                             <div className="flex items-center ml-6">
//                                 <input
//                                     type="radio"
//                                     id={`correct-option-${index}`}
//                                     name="correct-option" // Use the same name for all radio buttons in the group
//                                     className="form-radio h-5 w-5 text-[#7765DA] accent-[#7765DA]"
//                                     checked={option.isCorrect}
//                                     onChange={() => handleCorrectChange(index)}
//                                 />
//                                 <label htmlFor={`correct-option-${index}`} className="ml-2 text-gray-700 cursor-pointer">
//                                     Correct
//                                 </label>
//                             </div>
//                         </div>
//                     ))}
//                     <button
//                         onClick={handleAddOption}
//                         className="mt-4 ml-12 px-4 py-2 border-2 border-[#7765DA] flex items-center rounded-lg text-[#7765DA] hover:text-indigo-400 focus:outline-none"
//                     >
//                         <FaPlus size={10} className="mr-2" />
//                         Add More option
//                     </button>
//                 </div>
//             </div>

//             <hr className="my-8 border-t border-gray-200 w-full" />

//             <div className="flex justify-end w-full">
//                 <button
//                     className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-12 py-3 text-lg font-medium text-white shadow-xl transition-transform duration-200 hover:scale-105"
//                     onClick={handleCreatePoll}
//                 >
//                     Ask Question
//                 </button>
//             </div>
//         </div>
//     );
// }

import { useState } from 'react';
import { FaPoll, FaPlus } from 'react-icons/fa';
import io from 'socket.io-client';
import { TbTriangleInvertedFilled } from "react-icons/tb";

// Establish the socket connection outside the component
const socket = io('http://localhost:3000', { transports: ['websocket'] });

export default function CreatePollPage() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([{ text: '', isCorrect: false }, { text: '', isCorrect: false }]);
    const [timer, setTimer] = useState(60); // Timer state
    const timerOptions = [15, 30, 45, 60, 90, 120];

    const handleAddOption = () => {
        // Correctly adding a new option object
        setOptions([...options, { text: '', isCorrect: false }]);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const handleCorrectChange = (index) => {
        const newOptions = options.map((option, i) => ({
            ...option,
            isCorrect: i === index
        }));
        setOptions(newOptions);
    };

    const handleCreatePoll = () => {
        // Find the correct option text
        const correctOption = options.find(option => option.isCorrect)?.text;

        // Check if a correct option is selected
        if (!correctOption) {
            alert('Please select a correct answer.');
            return;
        }

        // Check if the question and all options are not empty
        if (question.trim() && options.every(option => option.text.trim())) {
            const pollData = {
                question,
                options: options.map(opt => opt.text),
                correctOption, // Send the text of the correct option
                timer: timer // ✨ CHANGED: No need for Number() conversion here
            };

            // ✨ ADDED: A console log to help you debug what's being sent
            console.log('Emitting poll data:', pollData);

            // Emit the 'createPoll' event to the server
            socket.emit('createPoll', pollData);
            
            // Navigate to the live polls page after emitting the event
            window.location.href = '/live-polls';
        } else {
            alert('Please enter a question and fill out all options.');
        }
    };


    // ... The rest of your JSX remains exactly the same
    return (
        <div className="flex w-[90vw] flex-col min-h-screen mx-30 items-start justify-center p-4">
            <div className="mb-4 inline-flex items-center rounded-full  bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white">
                <FaPoll className="mr-2 h-4 w-4" />
                Intervue Poll
            </div>

            <h1 className="mb-2 text-3xl  text-gray-800">Let's <span className='font-bold'>Get Started</span></h1>
            <p className="mb-8 text-gray-500">
                You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 w-full">
                {/* Question Input */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label htmlFor="question" className=" block text-xl font-medium text-gray-900">
                            Enter your question
                        </label>
                        <div className="relative inline-block w-40">
                            <select
                                value={timer}
                                onChange={(e) => setTimer(Number(e.target.value))}
                                className=" appearance-none rounded-lg border-none bg-[#6e6e6e]/10 px-3 py-2 pr-12 text-center font-medium text-lg text-gray-900 focus:outline-none "
                            >
                                {timerOptions.map((time) => (
                                    <option className='transition-all duration-300 ease-in-out' key={time} value={time}>
                                        {time} seconds
                                    </option>
                                ))}
                            </select>
                            <div className="cursor-pointer absolute transition-all duration-200 inset-y-0 right-0 flex items-center justify-center px-2 text-[#7765DA]">
                                <TbTriangleInvertedFilled />
                            </div>
                        </div>

                    </div>
                    <div className="relative">
                        <textarea
                            id="question"
                            rows="4"
                            className="w-full border-none bg-[#6e6e6e]/10 p-3 pr-20 text-gray-900 focus:outline-none "
                            placeholder="Type your question here..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            maxLength={100}
                            style={{ resize: 'none' }}
                        />
                        <span className="absolute bottom-3 right-3 text-sm text-gray-400">
                            {question.length}/100
                        </span>
                    </div>

                </div>
            </div>

            {/* Options Section */}
            <div className="mt-8 w-3/6">
                <div className="flex justify-between">
                    <h2 className="mb-4 text-xl font-semibold text-gray-700">Edit Options</h2>
                    <h2 className=" mb-4 text-xl font-semibold text-gray-700">Is it Correct?</h2>
                </div>
                <div className="space-y-4">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7765DA] text-white">
                                {index + 1}
                            </span>
                            <input
                                type="text"
                                className="flex-1 rounded-lg border-none bg-[#6e6e6e]/10 p-3 text-gray-900 focus:outline-none "
                                placeholder={`Option ${index + 1}`}
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                            {/* Simplified Radio Button Logic */}
                            <div className="flex items-center ml-6">
                                <input
                                    type="radio"
                                    id={`correct-option-${index}`}
                                    name="correct-option" // Use the same name for all radio buttons in the group
                                    className="form-radio h-5 w-5 text-[#7765DA] accent-[#7765DA]"
                                    checked={option.isCorrect}
                                    onChange={() => handleCorrectChange(index)}
                                />
                                <label htmlFor={`correct-option-${index}`} className="ml-2 text-gray-700 cursor-pointer">
                                    Correct
                                </label>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleAddOption}
                        className="mt-4 ml-12 px-4 py-2 border-2 border-[#7765DA] flex items-center rounded-lg text-[#7765DA] hover:text-indigo-400 focus:outline-none"
                    >
                        <FaPlus size={10} className="mr-2" />
                        Add More option
                    </button>
                </div>
            </div>

            <hr className="my-8 border-t border-gray-200 w-full" />

            <div className="flex justify-end w-full">
                <button
                    className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-12 py-3 text-lg font-medium text-white shadow-xl transition-transform duration-200 hover:scale-105"
                    onClick={handleCreatePoll}
                >
                    Ask Question
                </button>
            </div>
        </div>
    );
}


