import React, { useState, useEffect, useContext } from "react";
import { Button, Modal, Select, Checkbox } from "antd";
import axios from "axios";
import { API_BASE_PATH, API_ROUTES } from "../constants/api-endpoints";
import { StoryUploadApiContext } from "../contexts/ApiContext";

const { Option } = Select;
const ModifyMasterWsPopup = ({
  open,
  onClose,
  type,
  modifyItemObj,
  onModify = () => {},
  storyWorldOptions,
  types,
  clusterList,
  modalType
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [wsForm, setWsForm] = useState([]);
  const [typo, setTypo] = useState([]);
  const [clusterHead, setClusterHead] = useState([]);
  const [clusterHeadData, setClusterHeadData] = useState([]);
  const [saparate, setSaparate] = useState(false);
  const [clusterValue, setClusterValue] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [whoCluster, setWhoCluster] = useState([]);
  const [whatCluster, setWhatCluster] = useState([]);
  const [whereCluster, setWhereCluster] = useState([]);
  const [clusterHeadVals, setclusterHeadVals] = useState([]);
  const [clusterValuesVals, setclusterValuesVals] = useState([]);
  const [anythingChanged, setAnythingChanged] = useState(false)
  const {storyUploadApiResponse,setStoryUploadApiResponse,handleAnythingChanged,} = useContext(StoryUploadApiContext);  
  const { token, story_id, storyWorld, fileName, primaryWhos, masterWs, filterDatas } = storyUploadApiResponse;
  const tokenVal = JSON.parse(localStorage.getItem("accessToken"));
  const clusterTextData = clusterData?.map(obj => obj?.value);

  const handleClusterChange = () => {
    if (wsForm === "who") {
      setclusterHeadVals(clusterList.Who)
      setWhoCluster(clusterList?.Who);
    } else if (wsForm === "what") {
      setclusterHeadVals(clusterList.What)
      setWhatCluster(clusterList?.What);
    } else if (wsForm === "where") {
      setWhereCluster(clusterList?.Where);
      setclusterHeadVals(clusterList.Where);
    } else {
      setWhoCluster(null);
      setWhatCluster(null);
      setWhereCluster(null);
    }
  };

  useEffect(() => {
    handleClusterChange(); 
  }, [wsForm, clusterList]); 
  
  useEffect(() => {
    if(!anythingChanged){
      if (type === "title") {
        setCurrentValue(modifyItemObj?.title || "");
        setPopupTitle("Update Master W's");
      } else if (type === "situation") {
        setCurrentValue(modifyItemObj?.idea || "");
        setPopupTitle("Situation");
      } else {
        setCurrentValue(modifyItemObj?.idea || "");
        setPopupTitle("Action");
      }
      if(modalType === "InBetweenFlow") {
        setClusterHead(modifyItemObj?.masterHead);
        setClusterHeadId(modifyItemObj?.id || "");
      }
      if(modalType === "saparate" ) {
        setClusterHeadData(modifyItemObj?.masterHead)
      }
      setTypo(modifyItemObj?.type || []);
      setWsForm(modifyItemObj?.ws || []);
      if(modalType === "InBetweenFlow"){
        setClusterValue(modifyItemObj?.clusterValues?.map(obj => obj.value) || [])
      }
      if(modalType === "saparate") {
        setClusterData(modifyItemObj?.clusterValues || [])
      }
      if(modalType === "InBetweenFlow") {
        if(clusterValuesVals?.length === 0 && modifyItemObj?.masterHead?.id === clusterHead?.id){
          getClusterValueData(modifyItemObj?.masterHead,modifyItemObj?.id ?? clusterHeadId)
        }
      }
    }

  }, [modifyItemObj, type, clusterHead, clusterHeadVals]);

  const onWsChange = (value) => {
    setWsForm(value);
    if(modalType == "saparate") {
      setSaparate(true);
    }
    setAnythingChanged(true)
  }

  const onTypeChange = (value) => {
    setTypo(value);
    if(modalType == "saparate") {
      setSaparate(true);
    }
    setAnythingChanged(true)
  }
  const [clusterHeadId, setClusterHeadId] = useState("");
  const [clusterValueSet, setClusterValueSet] = useState();
 
  const onClusterHead = (selectedValue, fieldName) => {
    const selectedCluster = clusterHeadVals.find(item => item?.value === selectedValue);
    setClusterHead(selectedCluster?.value);
    setClusterHeadId(selectedCluster?.id); 
    if(modalType === "InBetweenFlow") {
    getClusterValueData(selectedCluster?.value,selectedCluster?.id)
    }
    setAnythingChanged(true) 
  };

  const onClusterValues = (selectedValue, fieldName) => {
    const valuesArray = Array?.isArray(selectedValue) ? selectedValue : [selectedValue];
    const selectedClusterObjects = valuesArray
    ?.map(value => clusterValuesVals.find(item => item?.value === value))
    ?.filter(Boolean);
    const updatedClusterValues = selectedClusterObjects?.map(item => item.value);
    const mergedClusterObjects = selectedClusterObjects?.map(item => ({
      id: item?.id,
      value: item?.value
    }));
    setClusterValue(updatedClusterValues);
    setClusterValueSet(mergedClusterObjects);
    setAnythingChanged(true);
  };
  const onClusterValuesText = (inputValue, fieldName) => {
    // Split the input values by commas, trim them, and filter out empty strings
    const valuesArray = inputValue
      .split(',')
      .map(value => value.trim())
      .filter(value => value); // Remove any empty strings
  
    // If no values are entered (empty input), do nothinghan
    if (valuesArray.length === 0) {
      return;
    }
  
    // Iterate through the clusterData and update only the matching values
    const updatedClusterData = clusterData.map(item => {
      // Try to find a matching value from input that starts with the current value in clusterData
      const match = valuesArray.find(value => value.startsWith(item.value)); // Match starts with the current value
      if (match) {
        return { ...item, value: match }; // Update the item with the new matched value
      }
      return item; // Keep the item unchanged if no match
    });
  
    // Update the clusterData state with the edited values
    setClusterData(updatedClusterData);
  
    // Trigger any necessary state changes (like separate logic or change detection)
    setSaparate(true);
    setAnythingChanged(true);
  };
  
  
  
  const onClusterHeadText = (inputValue, fieldName) => {
    setClusterHeadData(inputValue); 
    setSaparate(true);
    setAnythingChanged(true); 
  };
  
  const getClusterValueData = async (value, clusterId) => {
    if (clusterHeadVals?.length === 0) {
      console.error("clusterHeadVals is not yet available.");
      return; 
    }
  
    const apiUrl = API_BASE_PATH + API_ROUTES.SORT_WS + story_id;
    const payload = {
      clusterHead: { value: value, id: clusterId },
      ws: clusterHeadVals,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenVal}`,
      },
    };
  
    try {
      const response = await axios.post(apiUrl, payload, config);
      const filteredArray = response?.data?.ws?.clusterValues;
      const filteredArrays = filteredArray?.filter(
        (item) => item?.value !== value
      );
      setclusterValuesVals(filteredArrays);
    } catch (error) {
      console.error("Error calling the API:", error);
    }
  };

  const handleUpdate = () => {
    const updatedObj = {
      id: clusterHeadId ? clusterHeadId : modifyItemObj.id, 
      ws: wsForm, 
      type: typo || modifyItemObj.type, 
      masterHead: saparate ? clusterHeadData ?? modifyItemObj?.masterHead:clusterHead ?? modifyItemObj?.masterHead, 
      clusterValues: saparate ? (clusterData ??  modifyItemObj?.clusterValues):clusterValueSet ?? modifyItemObj?.clusterValues, 
    };
    onModify(updatedObj);
    onClose();
  };
  
  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      width={700}
      footer={[
        <div key="footer">
          <Button onClick={onClose} className="bg-gray-400 border-gray-500">
            Cancel
          </Button>
          {"   "}
          <Button
            onClick={handleUpdate}
            type="primary"
            className="text-blue-500 bg-blue-50"
          >
            Update
          </Button>
        </div>,
      ]}
    >
      <div>
        <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
          {popupTitle}
        </label>
        <div className="mt-8 mb-6">
        <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            Ws Form
          </label>
          <Select
            size="large"
            className="w-full"
            value={wsForm} 
            onChange={(value) => onWsChange(value, "wsForm")}
            placeholder={"Select Ws Form"}
          >
            {storyWorldOptions?.map((item, index) => (
              <Option key={item.name} value={item?.name}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mt-8 mb-6">
        <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            Type
          </label>
          <Select
            size="large"
            className="w-full"
            value={typo} // Bind value to the state variable
            onChange={(value) => onTypeChange(value, "typo")} // Pass name 'wsForm' to handleChange
            placeholder={"Select Type"}
          >
            {types?.map((item, index) => (
              <Option key={item.name} value={item?.name}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
        {modalType === "InBetweenFlow" && (
  <div>
    <div className="mt-8 mb-6">
      <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
        {"Cluster Head"}
      </label>
      <Select
        size="large"
        className="w-full"
        value={clusterHead}
        onChange={(value) => onClusterHead(value, "clusterHead")} // Pass name 'wsForm' to handleChange
        placeholder="Select Cluster Head"
      >
        {clusterHeadVals?.map((item) => (
          <Option key={item?.id} value={item?.value}>
            {item?.value}
          </Option>
        ))}
      </Select>
    </div>

    <div>
      <label
        htmlFor="secondaryWhos"
        className="block mb-2 text-md md:text-lg font-medium text-gray-900"
      >
        {"Cluster Value"}
      </label>
      <Select
        size="large"
        mode="tags"
        className="w-full"
        value={clusterValue}
        onChange={(value) => onClusterValues(value, "clusterValue")} // Pass name 'wsForm' to handleChange
        placeholder={"Select Cluster Values"}
      >
        {clusterValuesVals?.map((option) => (
          <Option key={option.id} value={option.value}>
            {option?.value}
          </Option>
        ))}
      </Select>
    </div>
  </div>
        )}
{modalType === "saparate" && (
  <>
    <div className="mt-8 mb-6">
      <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
        {"Cluster Head"}
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-lg text-md"
        value={clusterHeadData}
        onChange={(e) => onClusterHeadText(e.target.value, "clusterHead")} // Handle input change
        placeholder="Enter Cluster Head"
      />
    </div>

    <div>
      <label
        htmlFor="clusterVal"
        className="block mb-2 text-md md:text-lg font-medium text-gray-900"
      >
        {"Cluster Value"}
      </label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded-lg text-md"
        value={clusterData?.map(obj => obj?.value).join(', ')} // Join the values with commas
        onChange={(e) => onClusterValuesText(e.target.value, "clusterValue")} // Handle input change
        placeholder="Enter Cluster Values"
      />
    </div>
  </>
)}

      </div>
    </Modal>
  );
};

export default ModifyMasterWsPopup;
