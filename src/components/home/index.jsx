import { useContext, useEffect, useState } from "react";
import Footer from "../../utils/Footer";
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

const Home = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);
  const errorMsg = "Error In Fetching Saved Response";

  // story upload context
  const { storyUploadApiResponse, setStoryUploadApiResponse } = useContext(StoryUploadApiContext);
  const { storyWorld, storyWorldLead, titles, situations, actions } = storyUploadApiResponse;

  useEffect(() => {
    const storyId = JSON.parse(localStorage.getItem("storyId"));
    const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
    if(storyId && tokenVal) {
      fetchStoryData(storyId, tokenVal);
    }
  }, []);

  const getUpdatedJsonWs = (arr) => {
    if(arr && arr.length>0) {
      const updated = arr.map((item, index) => ({
        id: index + 1,
        name: item.value,
        isRadioSelected: item.type?.toLowerCase()==='primary' ? true : false,
        isCheckboxSelected: item.type?.toLowerCase()==='secondary' ? true : false,
      }));
      return updated;
    }
    return [];
  }

  const getWsPayload = (list, type) => {
    let names = [];
    if(type==='prim') {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type?.toLowerCase() === 'primary') {
          names.push(list[i].value);
        }
      }
    }
    else if(type==='sec') {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type?.toLowerCase() === 'secondary') {
          names.push(list[i].value);
        }
      }
    }
    return names;
  }

  const getUpdatedJsonTitles = (list) => {
    const arr = list[0]?.titles || [];
    if(arr && arr.length>0) {
      const updated = arr.map((item, index) => ({
        id: index + 1,
        sentence: item.Title,
        primaryWhos: item.Who_Primary,
        secondaryWhos: item.Who_Secondary,
        primaryWhats: item.What_Primary,
        secondaryWhats: item.What_Secondary,
        primaryWheres: item.Where_Primary,
        secondaryWheres: item.Where_Secondary,
      }));
      return updated;
    }
    return [];
  }

  const getUpdatedJson = (list) => {
    const arr = list[0]?.ideas || [];
    if(arr && arr.length>0) {
      const updated = arr.map((item, index) => ({
        id: index + 1,
        sentence: item.idea,
        primaryWhos: item.Who_Primary,
        secondaryWhos: item.Who_Secondary,
        primaryWhats: item.What_Primary,
        secondaryWhats: item.What_Secondary,
        primaryWheres: item.Where_Primary,
        secondaryWheres: item.Where_Secondary,
      }));
      return updated;
    }
    return [];
  }

  const fetchStoryData = async (story_id, token) => {
    try {
      const apiUrl = API_BASE_PATH + API_ROUTES.FETCH_STORY_DATA + `/${story_id}`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const output = await axios.get(apiUrl, config);
      if(output) {
        const respObj = output?.data?.data;
        console.log("respObj: ", respObj);

        const { story_text, story_id, story_world_id, storyWorld, story_file_name, titles, sitautions, actions } = respObj;
        const wsDataObj = respObj?.ws[0]?.ws_data;
        const { Who, What, Where } = wsDataObj;
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
          whos: getUpdatedJsonWs(Who),
          updatedWhos: getUpdatedJsonWs(Who),
          whats: getUpdatedJsonWs(What),
          updatedWhats: getUpdatedJsonWs(What),
          wheres: getUpdatedJsonWs(Where),
          updatedWheres: getUpdatedJsonWs(Where),
          primaryWhos: getWsPayload(Who, 'prim'),
          secondaryWhos: getWsPayload(Who, 'sec'),
          primaryWhats: getWsPayload(What, 'prim'),
          secondaryWhats: getWsPayload(What, 'sec'),
          primaryWheres: getWsPayload(Where, 'prim'),
          secondaryWheres: getWsPayload(Where, 'sec'),
          titles: getUpdatedJsonTitles(titles),
          updatedTitles: getUpdatedJsonTitles(titles),
          situations: getUpdatedJson(sitautions),
          updatedSituations: getUpdatedJson(sitautions),
          actions: getUpdatedJson(actions),
          updatedActions: getUpdatedJson(actions),
          token: token,
        };

        setStoryUploadApiResponse(saveObj); // save fetched data in context

        if(respObj?.titles?.length === 0) {
          setCurrentStep(1);
        } else if(respObj?.titles?.length>0 && respObj?.sitautions?.length===0) {
          setCurrentStep(2);
        } else if(respObj?.sitautions?.length>0 && respObj?.actions?.length===0) {
          setCurrentStep(3);
        } else if(respObj?.actions?.length>0) {
          setCurrentStep(5);
        }
      } else {
        message.error(errorMsg);
      }
    } catch (error) {
      console.log("error: ", error);
      message.error(errorMsg);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const bodyHeight = document.body.clientHeight;
      const windowHeight = window.innerHeight;
      setIsContentOverflowing(bodyHeight > windowHeight);
    };

    handleResize(); // Call initially to set the state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentStep]);

  const handlePreviousStep = () => {
    setCurrentStep(prevStep => prevStep - 1);
  }

  const handleNextStep = () => {
    setCurrentStep(prevStep => prevStep + 1);
  }

  const onDiscard = async () => {
    localStorage.removeItem("storyId");
    setCurrentStep(0);
    message.success('Changes Discarded Successfully !');
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  }

  return (
    <SidebarWithHeader>
      {/* <div className="p-2 relative"> */}
      {/* <div className={`flex flex-col ${isContentOverflowing ? 'sm:min-h-screen' : ''}`}> */}
      <div className={`flex flex-col sm:min-h-screen`}>
        {/* head */}
        <p className="text-xl md:text-3xl mt-1 mb-2 md:mb-0 font-medium">Guppy Stories</p>

        {/* body */}

        {/* stepper */}
        <div className="mt-3 md:mt-8 mb-5 bg-gray-50 p-3 border rounded-md">
          <Stepper currentStep={currentStep} />
        </div>

        {/* component based on step number */}
        <div className="flex-grow">
          {currentStep === 0 ? (
            <StoryUpload onSuccess={handleNextStep} />
          ) : currentStep === 1 ? (
            <ThreeWsSelection
              onDiscard={onDiscard}
            />
          ) : currentStep === 2 ? (
            <TitleSelection
              onDiscard={onDiscard}
            />
          ) : currentStep === 3 ? (
            <SituationSelection
              onDiscard={onDiscard}
            />
          ) : currentStep === 4 ? (
            <ActionSelection
              onDiscard={onDiscard}
            />
          ) : (
            <DownloadStory
              onDiscard={onDiscard}
            />
          )}
        </div>

        {/* <div className="flex justify-between px-2 md:px-8 mb-4 md:mb-8 items-center"> */}
          <div className="flex-shrink-0 flex justify-between">
            <button
              // className="text-white mt-6 bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800"
              className={`text-white mt-6 bg-gray-500 disabled:bg-gray-400 hover:bg-gray-400 focus:ring-4 focus:outline-none ring-primary-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800 ${!isContentOverflowing ? 'sm:absolute sm:bottom-5' : ''}`}
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
            >
              {"<<Prev"}
            </button>
            <button
              className={`text-white ml-2 right-6 mt-6 bg-blue-500 hover:bg-blue-300 disabled:bg-blue-300 focus:ring-4 focus:outline-none ring-danger-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800 ${!isContentOverflowing ? 'sm:absolute sm:bottom-5' : ''}`}
              onClick={handleNextStep}
              // disabled={!isFetched && ((currentStep === 0 && ( !storyWorld || !storyWorldLead )) || (currentStep===1 && titles?.length===0) || (currentStep===2 && situations?.length===0) || (currentStep===3 && actions?.length===0) || currentStep === 5)}
              disabled={(currentStep === 0 && ( !storyWorld || !storyWorldLead )) || (currentStep===1 && titles?.length===0) || (currentStep===2 && situations?.length===0) || (currentStep===3 && actions?.length===0) || currentStep === 5}
            >
              Next
            </button>
          </div>
        {/* </div> */}


        {/* footer */}
        {/* <Footer className={"sm:ml-64 p-1 bg-yellow-100 border"} /> */}
      </div>
    </SidebarWithHeader>
  );
};

export default Home;
