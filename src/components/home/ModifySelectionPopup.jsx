import { Button, Checkbox, Modal, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
// import 
// import { StoryUploadApiContext } from "../../contexts/ApiContext";
const { Option } = Select;

const ModifySelectionPopup = ({
  open,
  onClose = () => {},
  modifyItemObj,
  onModify = () => {},
  type,
}) => {
  const [currentValue, setCurrentValue] = useState("");
  const [popupTitle, setPopupTitle] = useState("");

  const [secondaryWhoOptions, setSecondaryWhoOptions] = useState([]);
  const [secondaryWhoSelectedOptions, setSecondaryWhoSelectedOptions] = useState([]);
  // whats
  const [primaryWhatOptions, setPrimaryWhatOptions] = useState([]);
  const [primaryWhatSelectedOptions, setPrimaryWhatSelectedOptions] = useState([]);
  const [secondaryWhatOptions, setSecondaryWhatOptions] = useState([]);
  const [secondaryWhatSelectedOptions, setSecondaryWhatSelectedOptions] = useState([]);
  // wheres
  const [primaryWhereOptions, setPrimaryWhereOptions] = useState([]);
  const [primaryWhereSelectedOptions, setPrimaryWhereSelectedOptions] = useState([]);
  const [secondaryWhereOptions, setSecondaryWhereOptions] = useState([]);
  const [secondaryWhereSelectedOptions, setSecondaryWhereSelectedOptions] = useState([]);

  // story upload context
  const { storyUploadApiResponse } = useContext(StoryUploadApiContext);
  const { primaryWhos, secondaryWhos, primaryWhats, secondaryWhats, primaryWheres, secondaryWheres } = storyUploadApiResponse;

  useEffect(() => {
    if(type === "title") {
        setCurrentValue(modifyItemObj.title);
        setPopupTitle("Title/Sentence");
    } else if(type === "situation") {
        setCurrentValue(modifyItemObj.idea);
        setPopupTitle("Situation");
    } else {
        setCurrentValue(modifyItemObj.idea);
        setPopupTitle("Action");
    }

    //secondaryWhos
    const tableSecondaryWhos = [...new Set([...modifyItemObj.secondaryWhos, ...secondaryWhos])];
    setSecondaryWhoOptions(tableSecondaryWhos);
    setSecondaryWhoSelectedOptions(modifyItemObj.secondaryWhos);
    // primaryWhats
    const tablePrimaryWhats = [...new Set([...modifyItemObj.primaryWhats, ...primaryWhats])];
    setPrimaryWhatOptions(tablePrimaryWhats);
    setPrimaryWhatSelectedOptions(modifyItemObj.primaryWhats);
    //secondaryWhats
    const tableSecondaryWhats = [...new Set([...modifyItemObj.secondaryWhats, ...secondaryWhats])];
    setSecondaryWhatOptions(tableSecondaryWhats);
    setSecondaryWhatSelectedOptions(modifyItemObj.secondaryWhats);
    // primaryWheres
    const tablePrimaryWheres = [...new Set([...modifyItemObj.primaryWheres, ...primaryWheres])];
    setPrimaryWhereOptions(tablePrimaryWheres);
    setPrimaryWhereSelectedOptions(modifyItemObj.primaryWheres);
    //secondaryWheres
    const tableSecondaryWheres = [...new Set([...modifyItemObj.secondaryWheres, ...secondaryWheres])];
    setSecondaryWhereOptions(tableSecondaryWheres);
    setSecondaryWhereSelectedOptions(modifyItemObj.secondaryWheres);
  }, []);

  const handleChange = (e) => {
    setCurrentValue(e.target.value);
  };

  // secondaryWhos
  const onSecondaryWhosChange = (value) => {
    setSecondaryWhoSelectedOptions(value);
  }
  const handleSelectAllSecondaryWhos = () => {
    if(secondaryWhoSelectedOptions.length === secondaryWhoOptions.length) {
        setSecondaryWhoSelectedOptions([]);
    } else {
        setSecondaryWhoSelectedOptions(secondaryWhoOptions);
    }
  }

  // primaryWhats
  const onPrimaryWhatsChange = (value) => {
    setPrimaryWhatSelectedOptions(value);
  }
  const handleSelectAllPrimaryWhats = () => {
    if(primaryWhatSelectedOptions.length === primaryWhatOptions.length) {
        setPrimaryWhatSelectedOptions([]);
    } else {
        setPrimaryWhatSelectedOptions(primaryWhatOptions);
    }
  }

  // secondaryWhats
  const onSecondaryWhatsChange = (value) => {
    setSecondaryWhatSelectedOptions(value);
  }
  const handleSelectAllSecondaryWhats = () => {
    if(secondaryWhatSelectedOptions.length === secondaryWhatOptions.length) {
        setSecondaryWhatSelectedOptions([]);
    } else {
        setSecondaryWhatSelectedOptions(secondaryWhatOptions);
    }
  }

  // primaryWheres
  const onPrimaryWheresChange = (value) => {
    setPrimaryWhereSelectedOptions(value);
  }
  const handleSelectAllPrimaryWheres = () => {
    if(primaryWhereSelectedOptions.length === primaryWhereOptions.length) {
        setPrimaryWhereSelectedOptions([]);
    } else {
        setPrimaryWhereSelectedOptions(primaryWhereOptions);
    }
  }

  // secondaryWheres
  const onSecondaryWheresChange = (value) => {
    setSecondaryWhereSelectedOptions(value);
  }
  const handleSelectAllSecondaryWheres = () => {
    if(secondaryWhereSelectedOptions.length === secondaryWhereOptions.length) {
        setSecondaryWhereSelectedOptions([]);
    } else {
        setSecondaryWhereSelectedOptions(secondaryWhereOptions);
    }
  }

//   const allPrimaryWhoSelected = primaryWhoSelectedOptions.length === primaryWhoOptions.length;
  const allSecondaryWhoSelected = secondaryWhoSelectedOptions.length === secondaryWhoOptions.length;
  const allPrimaryWhatSelected = primaryWhatSelectedOptions.length === primaryWhatOptions.length;
  const allSecondaryWhatSelected = secondaryWhatSelectedOptions.length === secondaryWhatOptions.length;
  const allPrimaryWhereSelected = primaryWhereSelectedOptions.length === primaryWhereOptions.length;
  const allSecondaryWhereSelected = secondaryWhereSelectedOptions.length === secondaryWhereOptions.length;

  const handleUpdate = () => {
    const updatedObj = {
        id: modifyItemObj.isNewField ? '' : modifyItemObj.id,
        ...(type === "title" ? {title: currentValue} : {idea: currentValue}),
        primaryWhos,
        secondaryWhos: secondaryWhoSelectedOptions,
        primaryWhats: primaryWhatSelectedOptions,
        secondaryWhats: secondaryWhatSelectedOptions,
        primaryWheres: primaryWhereSelectedOptions,
        secondaryWheres: secondaryWhereSelectedOptions,
        ...(modifyItemObj.isNewField ? {isNewField: true} : {isEditField: true}),
        ...(modifyItemObj.comment && {comment: modifyItemObj.comment})
    }
    onModify(updatedObj);
    onClose();
  }

  return (
    <Modal
      open={open}
      centered
      onCancel={onClose}
      width={700}
      footer={[
        <div>
          <Button
            onClick={onClose}
            className="mt-2 text-white bg-gray-400 border-gray-500 custom-btn md:mt-4 me-2 md:me-3"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            type="primary"
            className="text-blue-500 border-blue-500 bg-blue-50"
          >
            Update
          </Button>
        </div>,
      ]}
    >
      <div>
        {/* sentence */}
        <div>
          <label
            htmlFor="title"
            className="block mt-5 mb-2 font-medium text-gray-900 text-md md:text-lg"
          >
            {popupTitle}
          </label>
          <textarea
            rows={6}
            value={currentValue}
            onChange={handleChange}
            className="block w-full p-3 text-gray-900 border border-gray-300 rounded-md bg-gray-50 text-md focus:ring-primary-600 focus:border-primary-600"
          />
        </div>

        {/* W's Dropdowns */}
        <div className="grid grid-cols-1 gap-3 mt-8 mb-6 md:mb-16 md:grid-cols-2 md:gap-5">

            {/* secondary who dropdown */}
            <div>
                <label
                    htmlFor="secondaryWhos"
                    className="block mb-2 font-medium text-gray-900 text-md md:text-lg"
                >
                    Secondary WHOs
                </label>
                <Select
                    size="large"
                    mode="tags"
                    className="w-full"
                    value={secondaryWhoSelectedOptions}
                    onChange={onSecondaryWhosChange}
                    placeholder={"Please Select Secondary Whos"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allSecondaryWhoSelected}
                            onChange={handleSelectAllSecondaryWhos}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allSecondaryWhoSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {secondaryWhoOptions?.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* primary what dropdown */}
            <div>
                <label
                    htmlFor="primaryWhats"
                    className="block mb-2 font-medium text-gray-900 text-md md:text-lg"
                >
                    Primary WHATs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={primaryWhatSelectedOptions}
                    onChange={onPrimaryWhatsChange}
                    placeholder={"Please Select Primary Whats"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allPrimaryWhatSelected}
                            onChange={handleSelectAllPrimaryWhats}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allPrimaryWhatSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {primaryWhatOptions?.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* secondary what dropdown */}
            <div>
                <label
                    htmlFor="secondaryWhats"
                    className="block mb-2 font-medium text-gray-900 text-md md:text-lg"
                >
                    Secondary WHATs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={secondaryWhatSelectedOptions}
                    onChange={onSecondaryWhatsChange}
                    placeholder={"Please Select Secondary Whats"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allSecondaryWhatSelected}
                            onChange={handleSelectAllSecondaryWhats}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allSecondaryWhatSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {secondaryWhatOptions?.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* primary where dropdown */}
            <div>
                <label
                    htmlFor="primaryWheres"
                    className="block mb-2 font-medium text-gray-900 text-md md:text-lg"
                >
                    Primary WHEREs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={primaryWhereSelectedOptions}
                    onChange={onPrimaryWheresChange}
                    placeholder={"Please Select Primary Wheres"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allPrimaryWhereSelected}
                            onChange={handleSelectAllPrimaryWheres}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allPrimaryWhereSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {primaryWhereOptions?.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* secondary where dropdown */}
            <div>
                <label
                    htmlFor="secondaryWheres"
                    className="block mb-2 font-medium text-gray-900 text-md md:text-lg"
                >
                    Secondary WHEREs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={secondaryWhereSelectedOptions}
                    onChange={onSecondaryWheresChange}
                    placeholder={"Please Select Secondary Wheres"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allSecondaryWhereSelected}
                            onChange={handleSelectAllSecondaryWheres}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allSecondaryWhereSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {secondaryWhereOptions?.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>         
            </div>

        </div>
      </div>
    </Modal>
  );
};

export default ModifySelectionPopup;