import React, { createContext, useState } from 'react';

const StoryUploadApiContext = createContext();

const initialStateObj = {
  token: "",
  story_id: "",
  storyWorld: "",
  storyWorldId: "",
  storyWorldLead: "",
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
  const [isAnythingChanged, setIsAnythingChanged] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const handleAnythingChanged = (isChanged) => {
    setIsAnythingChanged(isChanged);
  }

  const handleSaveModalOpen = (isOpen) => {
    setSaveModalOpen(isOpen);
  }

  return (
    <StoryUploadApiContext.Provider value={{ 
      storyUploadApiResponse, 
      setStoryUploadApiResponse, 
      isAnythingChanged, 
      handleAnythingChanged, 
      saveModalOpen, 
      handleSaveModalOpen }}>
      {children}
    </StoryUploadApiContext.Provider>
  );
};

export { StoryUploadApiContext, StoryUploadApiProvider };