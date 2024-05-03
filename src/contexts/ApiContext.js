import React, { createContext, useState } from 'react';

const StoryUploadApiContext = createContext();

const StoryUploadApiProvider = ({ children }) => {
  const [storyUploadApiResponse, setStoryUploadApiResponse] = useState({});

  return (
    <StoryUploadApiContext.Provider value={{ storyUploadApiResponse, setStoryUploadApiResponse }}>
      {children}
    </StoryUploadApiContext.Provider>
  );
};

export { StoryUploadApiContext, StoryUploadApiProvider };