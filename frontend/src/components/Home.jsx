import { useState } from 'react';
import { FaPoll } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [selectedRole, setSelectedRole] = useState(null);
    const navigate = useNavigate();
    return (
        <div className="flex flex-col h-screen items-center justify-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                    <FaPoll className="mr-2 h-4 w-4" />
                    Intervue Poll
                </div>

                <h1 className="mb-2 text-4xl font-bold text-gray-800">
                    Welcome to the Live Polling System
                </h1>
                <p className="mb-8 text-gray-500">
                    Please select the role that best describes you to begin using the live polling system
                </p>

                <div className="mb-8 flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                    {/* Student Card */}
                    <div
                        className={`flex-1 cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${selectedRole === 'student'
                                ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                                : 'border-gray-200 hover:border-indigo-400'
                            }`}
                        onClick={() => setSelectedRole('student')}
                    >
                        <h2 className="mb-2 text-2xl font-semibold text-gray-700">I'm a Student</h2>
                        <p className="text-gray-500">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry
                        </p>
                    </div>

                    {/* Teacher Card */}
                    <div
                        className={`flex-1 cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 ${selectedRole === 'teacher'
                                ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                                : 'border-gray-200 hover:border-indigo-400'
                            }`}
                        onClick={() => setSelectedRole('teacher') }
                    >
                        <h2 className="mb-2 text-2xl font-semibold text-gray-700">I'm a Teacher</h2>
                        <p className="text-gray-500">
                            Submit answers and view live poll results in real-time.
                        </p>
                    </div>
                </div>

                <button
                    className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-12 py-3 text-lg font-medium text-white shadow-xl transition-transform duration-200 hover:scale-105 disabled:opacity-50"
                    disabled={!selectedRole}
                    onClick={() => { selectedRole === 'student' ? navigate('/student-home') : navigate('/create-poll') }}
                >
                    Continue
                </button>
        </div>
    );
}