import React from 'react';

/**
 * A simple lightning bolt icon component.
 */
const LightningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M11.3 1.046A1 1 0 0112 2v5.268l4.243-4.243a1 1 0 111.414 1.414L13.414 8.5H18a1 1 0 01.894 1.447l-8 10A1 1 0 019 20v-5.268l-4.243 4.243a1 1 0 11-1.414-1.414L7.586 11.5H3a1 1 0 01-.894-1.447l8-10a1 1 0 011.194-.007z"
      clipRule="evenodd"
    />
  </svg>
);


/**
 * A component that displays a "Kicked out" message.
 */
const KickedOutScreen = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center font-sans">
      <div className="text-center p-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-x-2 bg-purple-100 text-purple-700 text-sm font-semibold px-4 py-1.5 rounded-full">
          <LightningIcon />
          Intervue Poll
        </div>

        {/* Main Heading */}
        <h1 className="mt-8 text-4xl font-bold text-gray-800 tracking-tight">
          You've been Kicked out !
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-base text-gray-500 max-w-md mx-auto">
          Looks like the teacher had removed you from the poll system. Please Try again sometime.
        </p>

      </div>
    </div>
  );
};

export default KickedOutScreen;