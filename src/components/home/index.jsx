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

const Home = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isContentOverflowing, setIsContentOverflowing] = useState(false);

  // story upload context
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  const { storyWorld, leadWho } = storyUploadApiResponse;

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
              <StoryUpload />
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
            ) : (
              <ActionSelection
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
                disabled={currentStep === 0 && ( !storyWorld || !leadWho )}
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
