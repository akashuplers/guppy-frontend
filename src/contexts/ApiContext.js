import React, { createContext, useState } from 'react';

const StoryUploadApiContext = createContext();

const initialStateObj = {
  token: "",
  story_id: "",
  storyWorld: "",
  storyWorldId: "",
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
  updatedTitles: [],
  situations: [],
  updatedSituations: [],
  actions: [],
  updatedActions: [],
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