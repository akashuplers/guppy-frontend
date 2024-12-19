import React, { useState, useEffect } from "react";
import { Button, Modal, Select, Checkbox } from "antd";

const { Option } = Select;

const ModifyMasterWsPopup = ({
  open,
  onClose,
  type,
  modifyItemObj,
  onModify = () => {},
  storyWorldOptions,
  types,
  wsForms,
  filteredOptions,
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  // Options and selected values (for example purposes)
  const [secondaryWhoOptions, setSecondaryWhoOptions] = useState([]);
  const [secondaryWhoSelectedOptions, setSecondaryWhoSelectedOptions] =
    useState([]);

  const [primaryWhatOptions, setPrimaryWhatOptions] = useState([]);
  const [wsForm, setWsForm] = useState([]);
  const [typo, setTypo] = useState([]);
  const [clusterHead, setClusterHead] = useState([]);
  const [clusterValue, setClusterValue] = useState([]);

  console.log("wsForm", wsForm);
  console.log("storyWorldOptions", storyWorldOptions);
  console.log("clusterValue", clusterValue);
  

  // const storyWorldOptions = [
  //   { id: 1, name: "Who's" },
  //   { id: 2, name: "What's" },
  //   { id: 3, name: "Where's" },
  // ]
  // Update on receiving new `modifyItemObj`
  useEffect(() => {
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

    // For simplicity, assume options come from modifyItemObj or context
    setSecondaryWhoOptions(modifyItemObj?.secondaryWhos || []);
    setSecondaryWhoSelectedOptions(modifyItemObj?.secondaryWhos || []);
    setClusterHead(modifyItemObj?.clusterHead);
    setTypo(modifyItemObj?.type || []);
    setWsForm(modifyItemObj?.ws || []);
    setClusterValue(modifyItemObj?.clusterValue || [])
  }, [modifyItemObj, type]);

  const handleChange = (e) => {
    debugger
    setClusterHead(e.target.value);
  };

  const handleSelectAllSecondaryWhos = () => {
    if (secondaryWhoSelectedOptions.length === secondaryWhoOptions.length) {
      setSecondaryWhoSelectedOptions([]);
    } else {
      setSecondaryWhoSelectedOptions(secondaryWhoOptions);
    }
  };

  const handleSelectAllPrimaryWhats = () => {
    // if (primaryWhatSelectedOptions.length === primaryWhatOptions.length) {
    //   setPrimaryWhatSelectedOptions([]);
    // } else {
    //   setPrimaryWhatSelectedOptions(primaryWhatOptions);
    // }
  };

  const handleUpdate = () => {
    debugger
    const updatedObj = {
      id: modifyItemObj?.id || "", // ensure this is set correctly
       // Update with the respective value
      clusterValue: clusterValue, // Cluster value is also updated,
      clusterHead:clusterHead,
      wsForm:wsForm,
      typo:typo
    };
    onModify(updatedObj); // Call the passed function with the updated object
    onClose(); // Close the modal or the form
  };

  const onTypeChange = (value) => {
    setTypo(value);
  }

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
        {/* Editable text area */}
        <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
          {popupTitle}
        </label>
        <div className="mt-8 mb-6">
          <Select
            size="large"
            // mode="multiple"
            className="w-full"
            value={wsForm}
            onChange={handleChange}
            placeholder={"Select Ws Form"}
          >
            {/* <Option value="select-all">
              <Checkbox
                id="selectAllCheckbox"
                className="me-2"
                // checked={allPrimaryWhatSelected}
                onChange={handleSelectAllPrimaryWhats}
              />
              <label htmlFor="selectAllCheckbox">
                {/* {
                   allPrimaryWhatSelected ? "Unselect All" : "Select All"
                } */}
              {/* </label>
            </Option> */} 
            {wsForms?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item?.name}
              </Option>
            ))}
          </Select>
        </div>
        {/* Primary WHAT Dropdown */}
        <div className="mt-8 mb-6">
          <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            Type
          </label>
          <Select
            size="large"
            // mode="multiple"
            className="w-full"
            value={typo}
            onChange={handleChange}
            placeholder="Select Type"
          >
            {/* <Option value="select-all">
              <Checkbox
                // checked={primaryWhatSelectedOptions.length === primaryWhatOptions.length}
                onChange={handleSelectAllPrimaryWhats}
              />
              Select All
            </Option> */}
            {types?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label
            htmlFor="title"
            className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg"
          >
            {"Cluster Head"}
          </label>
          <input
            type="text" // Use "text" type for a single-line input field
            value={clusterHead}
            onChange={handleChange}
            id="title" // Ensure the input has an id if you need it for accessibility
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-md bg-gray-50 text-md focus:ring-primary-600 focus:border-primary-600"
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg"
          >
            {"Cluster Value"}
          </label>
          <input
            type="text" // Use "text" type for a single-line input field
            value={clusterValue}
            onChange={handleChange}
            id="title" // Ensure the input has an id if you need it for accessibility
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-md bg-gray-50 text-md focus:ring-primary-600 focus:border-primary-600"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModifyMasterWsPopup;
