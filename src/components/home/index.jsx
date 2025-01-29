import { useContext, useEffect, useState } from "react";
import SidebarWithHeader from "../sidebar-with-header";
import Stepper from "./Stepper";
import StoryUpload from "./StoryUpload";
import ThreeWsSelection from "./ThreeWsSelection";
import SituationSelection from "./SituationSelection";
import { message } from "antd";
import TitleSelection from "./TitleSelection";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
import ActionSelection from "./ActionSelection";
import DownloadStory from "./DownloadStory";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import SaveConfirmationDialog from "../../utils/modals/SaveConfirmationModal";
import MasterWssPage from "./master-wss";
import { UserGroupIcon } from "@heroicons/react/20/solid";
import UserHistory from "../history";

const Home = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaveChanges, setIsSaveChanges] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(null);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const errorMsg = "Error In Fetching Saved Response";
  const storyId = JSON.parse(localStorage.getItem("storyId"));
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const [prevStep, setPrevStep] = useState(false);
  
  // story upload context
  const {
    storyUploadApiResponse,
    setStoryUploadApiResponse,
    saveModalOpen,
    isAnythingChanged,
    handleAnythingChanged,
    handleSaveModalOpen,
  } = useContext(StoryUploadApiContext);
  const { storyWorld, storyWorldLead, titles, situations, actions } =
    storyUploadApiResponse;

  useEffect(() => {
    if (storyId && tokenVal) {
      fetchStoryData(storyId, tokenVal);
    }
    if (!storyId) {
      setCurrentStep(0);
    }
  }, []);
  
  useEffect(() => {
    if (currentStep === 1) {
      fetchStoryData(storyId, tokenVal);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isSaveSuccess) {
      if (activeStep === "next") {
        setCurrentStep((prevStep) => prevStep + 1);
      } else if (activeStep == "prev" && currentStep > 1) {
        setCurrentStep((prevStep) => prevStep - 1);
      } 
      setIsSaveSuccess(false);
      setActiveStep(null);
    }
  }, [isSaveSuccess]);

  const getUpdatedJsonWs = (arr) => {
    if (arr && arr.length > 0) {
      const updated = arr.map((item, index) => ({
        id: item.id,
        name: item.value,
        isCheckboxSelected: item.selected ? true : false,
        ner: item.ner ?? false,
      }));
      return updated;
    }
    return [];
  };

  const getUpdatedJsonTitles = (list) => {
    const arr = list[0]?.titles || [];
    if (arr && arr.length > 0) {
      const updated = arr.map((item, index) => ({
        id: item.id,
        title: item.Title,
        primaryWhos: item.Who_Primary,
        secondaryWhos: item.Who_Secondary,
        primaryWhats: item.What_Primary,
        secondaryWhats: item.What_Secondary,
        primaryWheres: item.Where_Primary,
        secondaryWheres: item.Where_Secondary,
        new: item.new,
        updated: item.updated
      }));
      return updated;
    }
    return [];
  };

  const getUpdatedJson = (list) => {
    const arr = list[0]?.ideas || [];
    if (arr && arr.length > 0) {
      const updated = arr.map((item, index) => ({
        id: item.id,
        idea: item.idea,
        primaryWhos: item.Who_Primary,
        secondaryWhos: item.Who_Secondary,
        primaryWhats: item.What_Primary,
        secondaryWhats: item.What_Secondary,
        primaryWheres: item.Where_Primary,
        secondaryWheres: item.Where_Secondary,
        new: item.new,
        updated: item.updated
      }));
      return updated;
    }
    return [];
  };
  
  const fetchStoryData = async (storyId, token) => {

    try {
      const apiUrl =
        API_BASE_PATH + API_ROUTES.FETCH_STORY_DATA + `/${storyId}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const output = await axios.get(apiUrl, config);
      const respObj = output?.data?.data;
      if (!respObj) {
        message.error("Invalid response from server. Please try again.");
        return;
      }
      if (output) {
        const respObj = output?.data?.data;
        const {
          story_text,
          story_id,
          story_world_id,
          storyWorld,
          story_file_name,
          masterws,
          titles,
          sitautions,
          actions,
        } = respObj;
        const wsDataObj = respObj?.ws[0]?.ws_data;
        const { Who, What, Where } = wsDataObj;
      const { who, what, where } = masterws?.masterWs || {};
        const extractIdAndValue = (data = []) =>
          data?.map(({ id, masterHead }) => ({
            id,
            value: masterHead || null,
          }));
        // Extract each category
        const primaryWho = extractIdAndValue(who?.primary || []);
        const secondaryWho = extractIdAndValue(who?.secondary || []);
        const primaryWhat = extractIdAndValue(what?.primary || []);
        const secondaryWhat = extractIdAndValue(what?.secondary || []);
        const primaryWhere = extractIdAndValue(where?.primary || []);
        const secondaryWhere = extractIdAndValue(where?.secondary || []);
        const contextObj = { ...storyUploadApiResponse };
        let saveObj = {
          ...contextObj,
          story_id: story_id,
          storyWorld: storyWorld?.name,
          storyWorldId: story_world_id,
          storyWorldLead: storyWorld.lead_who,
          storyLeadWho: storyWorld.lead_who,
          fileName: story_file_name,
          storyText: story_text,
          primaryWhos: primaryWho,
          secondaryWhos: secondaryWho,
          primaryWhats: primaryWhat,
          secondaryWhats: secondaryWhat,
          primaryWheres: primaryWhere,
          secondaryWheres: secondaryWhere,
          whos: getUpdatedJsonWs(Who),
          updatedWhos: getUpdatedJsonWs(Who),
          whats: getUpdatedJsonWs(What),
          updatedWhats: getUpdatedJsonWs(What),
          wheres: getUpdatedJsonWs(Where),
          updatedWheres: getUpdatedJsonWs(Where),
          titles: getUpdatedJsonTitles(titles),
          masterws:masterws,
          updatedTitles: getUpdatedJsonTitles(titles),
          situations: getUpdatedJson(sitautions),
          updatedSituations: getUpdatedJson(sitautions),
          actions: getUpdatedJson(actions),
          updatedActions: getUpdatedJson(actions),
          token: token,
        };
        
        setStoryUploadApiResponse(saveObj); 
        if (prevStep == false) {
          if (respObj?.masterws == null) {
            setCurrentStep(1);
          } else if (
            respObj?.masterws !== null && 
            respObj?.titles?.length > 0 &&
            respObj?.sitautions?.length === 0
          ) {
            setCurrentStep(2);
          } else if (
            respObj?.titles?.length > 0 && 
            respObj?.sitautions?.length > 0 &&
            respObj?.actions?.length === 0
          ) {
            setCurrentStep(3);
          } else if (
            respObj?.sitautions?.length > 0 &&
            respObj?.actions?.length > 0
          ) {
            setCurrentStep(4);
          } else if (respObj?.actions?.length > 0) {
            setCurrentStep(5);
          } else {
            setCurrentStep(1);
          }
        }
      }
    } catch (error) {
      console.log("error: ", error);
      message.error(errorMsg);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const bodyHeight = document.body.clientHeight;
      const windowHeight = window.innerHeight;
      setIsContentOverflowing(bodyHeight > windowHeight);
    };

    handleResize(); // Call initially to set the state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentStep]);

  const handlePreviousStep = () => {
    if (isAnythingChanged) {
      setActiveStep("prev");
      handleSaveModalOpen(true);
      setIsSaveChanges(false);
    } else {
      if(currentStep > 1) {
        setPrevStep(true);
        setCurrentStep((prevStep) => prevStep - 1);
      }
    }
  };

  const handleNextStep = () => {
    if (isAnythingChanged) {
      setActiveStep("next");
      handleSaveModalOpen(true);
      setIsSaveChanges(false);
    } else {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  const onDiscard = async () => {
    localStorage.removeItem("storyId");
    setCurrentStep(0);
    message.success("Changes Discarded Successfully !");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.location.reload();
  };

  const handleSaveSuccess = (isSaved) => {
    setIsSaveSuccess(isSaved);
    setIsSaveChanges(false);
  };

  const handleSaveModal = () => {
    setIsSaveChanges(true);
    handleSaveModalOpen(false);
    handleAnythingChanged(false);
  };

  const handleSaveModalClose = () => {
    handleSaveModalOpen(false);
    handleAnythingChanged(false);
    if (activeStep === "next") {
      setCurrentStep((prevStep) => prevStep + 1);
    } else if (activeStep === "prev" && currentStep > 1) {
        setCurrentStep((prevStep) => prevStep - 1);
      }
  };

  return (
    <SidebarWithHeader>
      <div className={`flex flex-col sm:min-h-screen`}>
        {/* head */}
        <p className="text-xl md:text-3xl mt-1 mb-2 md:mb-0 font-medium">
          Guppy Stories
        </p>
        {/* body */}

        {/* stepper */}
        <div className="p-3 mt-3 mb-5 border rounded-md md:mt-8 bg-gray-50">
          <Stepper currentStep={currentStep} />
        </div>

        {/* component based on step number */}
        <div className="flex-grow">
          {currentStep === 0 ? (
            <StoryUpload onSuccess={handleNextStep} />
          ) : currentStep === 1 ? (
            <ThreeWsSelection
              storyId={storyId}
              tokenVal={tokenVal}
              onDiscard={onDiscard}
              saveWs={isSaveChanges}
              handleSaveSuccess={handleSaveSuccess}
            />

          ):
           currentStep === 2 ? (
            <MasterWssPage
            storyId={storyId}
            tokenVal={tokenVal}
            onDiscard={onDiscard}
            saveMasterWs={isSaveChanges}
            handleSaveSuccess={handleSaveSuccess}
          />
          ) : currentStep === 3 ? (
            <TitleSelection
              storyId={storyId}
              tokenVal={tokenVal}
              onDiscard={onDiscard}
              saveTitles={isSaveChanges}
              handleSaveSuccess={handleSaveSuccess}
            />
          ) : currentStep === 4 ? (
            <SituationSelection
            storyId={storyId}
            tokenVal={tokenVal}
            onDiscard={onDiscard}
            saveSituations={isSaveChanges}
            handleSaveSuccess={handleSaveSuccess}
          />
          ) : currentStep === 5 ? (
            <ActionSelection
              storyId={storyId}
              tokenVal={tokenVal}
              onDiscard={onDiscard}
              saveActions={isSaveChanges}
              handleSaveSuccess={handleSaveSuccess}
            />
          )  : (
            <DownloadStory onDiscard={onDiscard} />
          )}
        </div>

        <div className="flex justify-between flex-shrink-0">
          {!(currentStep === 0 || currentStep === 1) && (
            <button
              className={`text-white mt-6 bg-gray-500 disabled:bg-gray-400 hover:bg-gray-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800 ${
                !isContentOverflowing ? "sm:absolute sm:bottom-5" : ""
              }`}
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
            >
              {"<<Prev"}
            </button>
          )}
          <button
            className={`text-white ml-2 mt-6 bg-blue-500 hover:bg-blue-300 disabled:bg-blue-300 focus:ring-4 focus:outline-none ring-danger-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800 ${
              !isContentOverflowing
                ? "sm:absolute sm:bottom-5 right-0"
                : "ml-auto"
            }`}
            onClick={handleNextStep}
            disabled={currentStep === 0 && (!storyWorld || !storyWorldLead)}
          >
            Next
          </button>
        </div>

        {saveModalOpen && (
          <SaveConfirmationDialog
            open={saveModalOpen}
            onConfirm={handleSaveModal}
            onClose={handleSaveModalClose}
          />
        )}
      </div>
    </SidebarWithHeader>
  );
};

export default Home;
