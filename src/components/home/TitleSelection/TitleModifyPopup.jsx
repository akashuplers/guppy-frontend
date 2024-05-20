import { Button, Checkbox, Modal, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { StoryUploadApiContext } from "../../../contexts/ApiContext";
const { Option } = Select;

const TitleModifyPopup = ({
  open,
  onClose = () => {},
  modifyItemObj,
  onModify = () => {},
}) => {
  const [currentValue, setCurrentValue] = useState("");
  // whos
  const [primaryWhoOptions, setPrimaryWhoOptions] = useState([]);
  const [primaryWhoSelectedOptions, setPrimaryWhoSelectedOptions] = useState([]);
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
    setCurrentValue(modifyItemObj.sentence);

    // primaryWhos
    const tablePrimaryWhos = [...new Set([...modifyItemObj.primaryWhos, ...primaryWhos])];
    setPrimaryWhoOptions(tablePrimaryWhos);
    setPrimaryWhoSelectedOptions(modifyItemObj.primaryWhos);
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

  // primaryWhos
  const onPrimaryWhosChange = (value) => {
    setPrimaryWhoSelectedOptions(value);
  }
  const handleSelectAllPrimaryWhos = () => {
    if(primaryWhoSelectedOptions.length === primaryWhoOptions.length) {
        setPrimaryWhoSelectedOptions([]);
    } else {
        setPrimaryWhoSelectedOptions(primaryWhoOptions);
    }
  }

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

  const allPrimaryWhoSelected = primaryWhoSelectedOptions.length === primaryWhoOptions.length;
  const allSecondaryWhoSelected = secondaryWhoSelectedOptions.length === secondaryWhoOptions.length;
  const allPrimaryWhatSelected = primaryWhatSelectedOptions.length === primaryWhatOptions.length;
  const allSecondaryWhatSelected = secondaryWhatSelectedOptions.length === secondaryWhatOptions.length;
  const allPrimaryWhereSelected = primaryWhereSelectedOptions.length === primaryWhereOptions.length;
  const allSecondaryWhereSelected = secondaryWhereSelectedOptions.length === secondaryWhereOptions.length;

  const handleUpdate = () => {
    const updatedObj = {
        id: modifyItemObj.id,
        sentence: currentValue,
        primaryWhos: primaryWhoSelectedOptions,
        secondaryWhos: secondaryWhoSelectedOptions,
        primaryWhats: primaryWhatSelectedOptions,
        secondaryWhats: secondaryWhatSelectedOptions,
        primaryWheres: primaryWhereSelectedOptions,
        secondaryWheres: secondaryWhereSelectedOptions,
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
            className="custom-btn mt-2 md:mt-4 me-2 md:me-3 bg-gray-400 border-gray-500 text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            type="primary"
            className="bg-blue-50 border-blue-500 text-blue-500"
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
            htmlFor="sentence"
            className="block mb-2 mt-5 text-md md:text-lg font-medium text-gray-900"
          >
            Sentence/Title
          </label>
          <textarea
            rows={6}
            value={currentValue}
            onChange={handleChange}
            className="bg-gray-50 w-full border p-3 border-gray-300 text-gray-900 text-md rounded-md focus:ring-primary-600 focus:border-primary-600 block"
          />
        </div>

        {/* W's Dropdowns */}
        <div className="mt-8 mb-6 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            {/* primary who dropdown */}
            <div>
                <label
                    htmlFor="primaryWhos"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
                >
                    Primary WHOs
                </label>
                <Select
                    size="large"
                    mode="multiple"
                    className="w-full"
                    value={primaryWhoSelectedOptions}
                    onChange={onPrimaryWhosChange}
                    placeholder={"Please Select Primary Whos"}
                >
                    <Option value="select-all">
                        <Checkbox
                            id="selectAllCheckbox"
                            className="me-2"
                            checked={allPrimaryWhoSelected}
                            onChange={handleSelectAllPrimaryWhos}
                        />
                        <label htmlFor="selectAllCheckbox">
                        {
                            allPrimaryWhoSelected ? "Unselect All" : "Select All"
                        }
                        </label>
                    </Option>
                    {primaryWhoOptions?.map((option, index) => (
                        <Option key={index} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>         
            </div>

            {/* secondary who dropdown */}
            <div>
                <label
                    htmlFor="secondaryWhos"
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
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
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
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
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
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
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
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
                    className="block mb-2 text-md md:text-lg font-medium text-gray-900"
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

export default TitleModifyPopup;
