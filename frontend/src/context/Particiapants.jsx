// src/context/ParticipantContext.js

import React, { createContext, useState, useContext } from 'react';

// Create the context
const ParticipantContext = createContext();

// Create a custom hook for easy access to the context
export const useParticipant = () => {
  return useContext(ParticipantContext);
};

// Create the Provider component that will wrap your app
export const ParticipantProvider = ({ children }) => {
  const [participantName, setParticipantName] = useState('');

  const value = {
    participantName,
    setParticipantName,
  };

  return (
    <ParticipantContext.Provider value={value}>
      {children}
    </ParticipantContext.Provider>
  );
};