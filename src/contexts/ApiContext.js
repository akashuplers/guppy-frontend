import React, { createContext, useState } from 'react';

const StoryUploadApiContext = createContext();

const initialStateObj = {
  token: "",
  story_id: "",
  storyWorld: "",
  leadWho: "",
  storyLeadWho: "",
  fileName: "",
  storyText: "",
  whos: [],
  updatedWhos: [],
  whats: [],
  updatedWhats: [],
  wheres: [],
  updatedWheres: [],
  primaryWhos: [],
  secondaryWhos: [],
  primaryWhats: [],
  secondaryWhats: [],
  primaryWheres: [],
  secondaryWheres: [],
  titles: [],
};

const StoryUploadApiProvider = ({ children }) => {
  const [storyUploadApiResponse, setStoryUploadApiResponse] = useState(initialStateObj);

  return (
    <StoryUploadApiContext.Provider value={{ storyUploadApiResponse, setStoryUploadApiResponse }}>
      {children}
    </StoryUploadApiContext.Provider>
  );
};

export { StoryUploadApiContext, StoryUploadApiProvider };