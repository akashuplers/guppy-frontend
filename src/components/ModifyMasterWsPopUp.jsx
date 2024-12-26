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
  clusterHeads,
  filteredOptions,
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");
  const [secondaryWhoOptions, setSecondaryWhoOptions] = useState([]);
  const [secondaryWhoSelectedOptions, setSecondaryWhoSelectedOptions] =
    useState([]);

  const [primaryWhatOptions, setPrimaryWhatOptions] = useState([]);
  const [wsForm, setWsForm] = useState([]);
  const [typo, setTypo] = useState([]);
  const [clusterHead, setClusterHead] = useState([]);
  const [clusterValue, setClusterValue] = useState([]);
  
  console.log("clusterHead", clusterHead);
  
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

    setSecondaryWhoOptions(modifyItemObj?.secondaryWhos || []);
    setSecondaryWhoSelectedOptions(modifyItemObj?.secondaryWhos || []);
    setClusterHead(modifyItemObj?.masterHead);
    setTypo(modifyItemObj?.type || []);
    setWsForm(modifyItemObj?.ws || []);
    setClusterValue(modifyItemObj?.clusterValue || [])
  }, [modifyItemObj, type]);
console.log();

  const handleChange = (value, name) => {
    debugger
    switch (name) {
      case 'wsForm':
        setWsForm(value);
        break;
      case 'typo':
        setTypo(value); 
        break;
      case 'clusterHead':
        setClusterHead(value); 
        break;
      case 'clusterValue':
        setClusterValue(value);
        break;
      default:
        break;
    }
  };  

  const handleClusterValue = () => {
    if(secondaryWhoSelectedOptions.length === secondaryWhoOptions.length) {
        setSecondaryWhoSelectedOptions([]);
    } else {
        setSecondaryWhoSelectedOptions(secondaryWhoOptions);
    }
  }

  const handleUpdate = () => {
    debugger
    const updatedObj = {
      id: modifyItemObj.isNewField ? '' : modifyItemObj.id,
      ...(type === "title" ? { title: currentValue } : { idea: currentValue }),
      ...(modifyItemObj.isNewField ? { isNewField: true } : { isEditField: true }),
      wsForm, 
      typo, 
      clusterHead, 
      clusterValue, 
    };
  
    onModify(updatedObj); // Pass the updated object to onModify
    onClose(); // Close the modal
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
          <Select
            size="large"
            className="w-full"
            value={wsForm} // Bind value to the state variable
            onChange={(value) => handleChange(value, "wsForm")} // Pass name 'wsForm' to handleChange
            placeholder={"Select Ws Form"}
          >
            {storyWorldOptions?.map((item, index) => (
              <Option key={index} value={item?._id}>
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
            value={typo}
            onChange={handleChange}
            placeholder="Select Type"
          >
            {types?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="mt-8 mb-6">
          <label className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg">
            {"Cluster Head"}
          </label>
          <Select
            size="large"
            className="w-full"
            value={clusterHead}
            onChange={handleChange}
            placeholder="Select Type"
          >
            {clusterHeads?.map((item, index) => (
              <Option key={index} value={item?._id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        <div>
          <label
            htmlFor="secondaryWhos"
            className="block mb-2 text-md md:text-lg font-medium text-gray-900"
          >
            "Cluster Value"
          </label>
          <Select
            size="large"
            mode="tags"
            className="w-full"
            value={clusterValue}
            onChange={handleChange}
            placeholder={"Select Cluster Values"}
          >
            {filteredOptions?.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </Modal>
  );
};

export default ModifyMasterWsPopup;
