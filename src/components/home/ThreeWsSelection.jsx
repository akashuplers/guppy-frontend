import React, { useContext, useEffect, useState } from "react";
import FooterButtons from "./FooterButtons";
import DeleteConfirmationDialog from "../../utils/modals/DeleteConfirmationDialog";
import { message } from "antd";
import EditModal from "./EditModal";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StoryTextPopup from "./StoryTextPopup";

const ThreeWsSelection = ({ onDiscard = () => {} }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletionItem, setDeletionItem] = useState({});
  const [type, setType] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [whoItems, setWhoItems] = useState([]);
  const [whatItems, setWhatItems] = useState([]);
  const [whereItems, setWhereItems] = useState([]);
  const [primaryWhos, setPrimaryWhos] = useState([]);
  const [secondaryWhos, setSecondaryWhos] = useState([]);
  const [primaryWhats, setPrimaryWhats] = useState([]);
  const [secondaryWhats, setSecondaryWhats] = useState([]);
  const [primaryWheres, setPrimaryWheres] = useState([]);
  const [secondaryWheres, setSecondaryWheres] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);

  // story upload context
  const { storyUploadApiResponse, setStoryUploadApiResponse } = useContext(StoryUploadApiContext);
  const navigate = useNavigate();
  const {
    story_id,
    storyWorld,
    fileName,
    whos,
    whats,
    wheres,
    updatedWhos,
    updatedWhats,
    updatedWheres,
    token,
  } = storyUploadApiResponse;

  useEffect(() => {
    const { primaryWhos, secondaryWhos, primaryWhats, secondaryWhats, primaryWheres, secondaryWheres } = storyUploadApiResponse;
    setWhoItems(updatedWhos);
    setWhatItems(updatedWhats);
    setWhereItems(updatedWheres);
    setPrimaryWhos(primaryWhos);
    setSecondaryWhos(secondaryWhos);
    setPrimaryWhats(primaryWhats);
    setSecondaryWhats(secondaryWhats);
    setPrimaryWheres(primaryWheres);
    setSecondaryWheres(secondaryWheres);
  }, []);

  const handleWhoRadioChange = (item) => {
    const updatedArr = whoItems.map((ele) => {
      // If the current item is the one being clicked, set its isRadioSelected to true
      // Otherwise, set its isRadioSelected to false
      return {
        ...ele,
        isRadioSelected: ele.id === item.id,
      };
    });
  
    setWhoItems(updatedArr);
    setPrimaryWhos([item.name]);
  };

  const handleWhoCheckboxChange = (item) => {
    if (item.isCheckboxSelected) {
      const filteredArr = secondaryWhos.filter(
        (ele) => ele.toLowerCase() !== item.name.toLowerCase()
      );
      setSecondaryWhos(filteredArr);
    } else {
      setSecondaryWhos([...secondaryWhos, item?.name]);
    }
    const updatedItem = {
      ...item,
      isCheckboxSelected: !item.isCheckboxSelected,
    };
    const updatedArr = whoItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhoItems(updatedArr);
  };

  const handleWhatRadioChange = (item) => {
    if(item.isRadioSelected) {
      const filteredArr = primaryWhats.filter(
        (ele) => ele.toLowerCase() !== item.name.toLowerCase()
      );
      setPrimaryWhats(filteredArr);
    } else {
      setPrimaryWhats([...primaryWhats, item?.name]);
    }
    const updatedItem = { ...item, isRadioSelected: !item.isRadioSelected };
    const updatedArr = whatItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhatItems(updatedArr);
  };

  const handleWhatCheckboxChange = (item) => {
    if (item.isCheckboxSelected) {
      const filteredArr = secondaryWhats.filter(
        (ele) => ele.toLowerCase() !== item.name.toLowerCase()
      );
      setSecondaryWhats(filteredArr);
    } else {
      setSecondaryWhats([...secondaryWhats, item?.name]);
    }
    const updatedItem = {
      ...item,
      isCheckboxSelected: !item.isCheckboxSelected,
    };
    const updatedArr = whatItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhatItems(updatedArr);
  };

  const handleWhereRadioChange = (item) => {
    if(item.isRadioSelected) {
      const filteredArr = primaryWheres.filter(
        (ele) => ele.toLowerCase() !== item.name.toLowerCase()
      );
      setPrimaryWheres(filteredArr);
    } else {
      setPrimaryWheres([...primaryWheres, item?.name]);
    }

    const updatedItem = { ...item, isRadioSelected: !item.isRadioSelected };
    const updatedArr = whereItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhereItems(updatedArr);
  };

  const handleWhereCheckboxChange = (item) => {
    if (item.isCheckboxSelected) {
      const filteredArr = secondaryWheres.filter(
        (ele) => ele.toLowerCase() !== item.name.toLowerCase()
      );
      setSecondaryWheres(filteredArr);
    } else {
      setSecondaryWheres([...secondaryWheres, item?.name]);
    }
    const updatedItem = {
      ...item,
      isCheckboxSelected: !item.isCheckboxSelected,
    };
    const updatedArr = whereItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhereItems(updatedArr);
  };

  const onDelete = (deletionItem) => {
    if (type === "who") {
      const updatedArr = whoItems.filter((ele) => ele.id !== deletionItem.id);
      setWhoItems(updatedArr);
      if (deletionItem.isRadioSelected) {
        const updated = primaryWhos.filter(
          (ele) => ele.toLowerCase() !== deletionItem.name.toLowerCase()
        );
        setPrimaryWhos(updated);
      }
      if (deletionItem.isCheckboxSelected) {
        const updated = secondaryWhos.filter(
          (ele) => ele.toLowerCase() !== deletionItem.name.toLowerCase()
        );
        setSecondaryWhos(updated);
      }
    } else if (type === "what") {
      const updatedArr = whatItems.filter((ele) => ele.id !== deletionItem.id);
      setWhatItems(updatedArr);
      if (deletionItem.isRadioSelected) {
        const updated = primaryWhats.filter(
          (ele) => ele.toLowerCase() !== deletionItem.name.toLowerCase()
        );
        setPrimaryWhats(updated);
      }
      if (deletionItem.isCheckboxSelected) {
        const updated = secondaryWhats.filter(
          (ele) => ele.toLowerCase() !== deletionItem.name.toLowerCase()
        );
        setSecondaryWhats(updated);
      }
    } else {
      const updatedArr = whereItems.filter((ele) => ele.id !== deletionItem.id);
      setWhereItems(updatedArr);
      if (deletionItem.isRadioSelected) {
        const updated = primaryWheres.filter(
          (ele) => ele.toLowerCase() !== deletionItem.name.toLowerCase()
        );
        setPrimaryWheres(updated);
      }
      if (deletionItem.isCheckboxSelected) {
        const updated = secondaryWheres.filter(
          (ele) => ele.toLowerCase() !== deletionItem.name.toLowerCase()
        );
        setSecondaryWheres(updated);
      }
    }
    message.success("Deleted Successfully !");
  };

  const onUpdate = (editItemObj, updatedValue) => {
    if (type === "who") {
      const updatedObj = { ...editItemObj, newName: updatedValue };
      const updatedArr = whoItems.map((ele) =>
        ele.id === editItemObj.id ? updatedObj : ele
      );
      setWhoItems(updatedArr);
      if (editItemObj.isRadioSelected) {
        const newList = [...primaryWhos];
        const index = newList.indexOf(editItemObj.name);
        newList[index] = updatedValue;
        setPrimaryWhos(newList);
      }
      if (editItemObj.isCheckboxSelected) {
        const newList = [...secondaryWhos];
        const index = newList.indexOf(editItemObj.name);
        newList[index] = updatedValue;
        setSecondaryWhos(newList);
      }
    } else if (type === "what") {
      const updatedObj = { ...editItemObj, newName: updatedValue };
      const updatedArr = whatItems.map((ele) =>
        ele.id === editItemObj.id ? updatedObj : ele
      );
      setWhatItems(updatedArr);
      if (editItemObj.isRadioSelected) {
        const newList = [...primaryWhats];
        const index = newList.indexOf(editItemObj.name);
        newList[index] = updatedValue;
        setPrimaryWhats(newList);
      }
      if (editItemObj.isCheckboxSelected) {
        const newList = [...secondaryWhats];
        const index = newList.indexOf(editItemObj.name);
        newList[index] = updatedValue;
        setSecondaryWhats(newList);
      }
    } else {
      const updatedObj = { ...editItemObj, newName: updatedValue };
      const updatedArr = whereItems.map((ele) =>
        ele.id === editItemObj.id ? updatedObj : ele
      );
      setWhereItems(updatedArr);
      if (editItemObj.isRadioSelected) {
        const newList = [...primaryWheres];
        const index = newList.indexOf(editItemObj.name);
        newList[index] = updatedValue;
        setPrimaryWheres(newList);
      }
      if (editItemObj.isCheckboxSelected) {
        const newList = [...secondaryWheres];
        const index = newList.indexOf(editItemObj.name);
        newList[index] = updatedValue;
        setSecondaryWheres(newList);
      }
    }
    message.success("Updated Successfully !");
  };

  const onReset = () => {
    resetAll();
    message.success("Reset Successfully !");
  };

  const getUpdatedJson = (arr) => {
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

  const onSave = async () => {
    setIsSubmitting(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.SAVE_Ws;
      const payload = bodyForSaveWsApi();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      // show loader alert
      alertKey = message.loading("Saving Ws...", 0).key;

      const response = await axios.post(apiUrl, payload, config); // post api request
      const output = response?.data;
      if (output) {
        const { titles } = output;

        // update context
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          primaryWhos,
          secondaryWhos,
          primaryWhats,
          secondaryWhats,
          primaryWheres,
          secondaryWheres,
          titles: getUpdatedJson(titles),
          updatedTitles: getUpdatedJson(titles),
          updatedWhos: whoItems,
          updatedWhats: whatItems,
          updatedWheres: whereItems,
        };

        setStoryUploadApiResponse(updatedContextObj);

        message.destroy(alertKey); // stop infinite loader alert
        message.success("Ws Saved Successfully !");

      } else {
        message.destroy(alertKey); // stop infinite loader alert
        message.error("Error In Saving Ws ! Unable To Fetch Response !");
      }
    } catch (error) {
      console.error("Error:", error);
      message.destroy(alertKey); // stop infinite loader alert
      const statusCode = error?.response?.status;
      if (statusCode === 401) {
        message.error("Not Authorized ! You need to login first !");
        navigate("/");
      } else if (statusCode === 500) {
        message.error("Internal Server Error !");
      } else {
        const errorMessage = error?.response?.data?.message;
        if (errorMessage) {
          message.error(errorMessage);
        } else {
          message.error(
            "Error In Saving Ws ! Unable To Fetch Response !"
          );
        }
      }
    }
    setIsSubmitting(false);
  };

  // const bodyForSaveWsApi = () => {
  //   const Who = createWsArray(primaryWhos, secondaryWhos);
  //   const What = createWsArray(primaryWhats, secondaryWhats);
  //   const Where = createWsArray(primaryWheres, secondaryWheres);
  //   const body = { Who, What, Where, story_id };
  //   return body;
  // };

  const bodyForSaveWsApi = () => {
    const Who = createWsArray(whoItems);
    const What = createWsArray(whatItems);
    const Where = createWsArray(whereItems);
    const body = { Who, What, Where, story_id };
    return body;
  };

  // const createWsArray = (primaryArr, secondaryArr) => {
  //   const primArr = primaryArr?.map((item) => ({
  //     type: "Primary",
  //     value: item,
  //   }));
  //   const secArr = secondaryArr?.map((item) => ({
  //     type: "Secondary",
  //     value: item,
  //   }));
  //   const combined = [...primArr, ...secArr];
  //   return combined;
  // };

  const createWsArray = (wsList) => {
    let updated = wsList?.map((item) => ({
      type: item.isRadioSelected ? "Primary" : item.isCheckboxSelected ? "Secondary" : "null",
      value: item.name,
      newValue: item.newName,
    }));
    return updated;
  };

  const addNewFields = () => {
    const newField = {
      isCheckboxSelected: false,
      isRadioSelected: false,
      name: "text",
    };
    
    setWhoItems((prev) => [{id: whoItems.length + 1, ...newField}, ...prev]);
    setWhatItems((prev) => [{id: whatItems.length + 1, ...newField}, ...prev]);
    setWhereItems((prev) => [{id: whereItems.length + 1, ...newField}, ...prev]);
  };

  const handleDiscard = () => {
    resetAll();
    onDiscard();
  };

  const resetAll = () => {
    setWhoItems(whos);
    setWhatItems(whats);
    setWhereItems(wheres);
    setPrimaryWhos([]);
    setPrimaryWhats([]);
    setPrimaryWheres([]);
    setSecondaryWhos([]);
    setSecondaryWhats([]);
    setSecondaryWheres([]);
  };

  return (
    <div className="px-5 pb-5 rounded-md border">
      <div className="text-lg flex flex-col md:flex-row justify-between md:text-xl mt-5 mb-3 md:mb-4">
        <p>Step-2 : Three W's Selection</p>
        <p className="text-lg md:text-xl mt-2 md:mt-0">
          Story World : <span className="text-violet-500">{storyWorld}</span>
        </p>
      </div>

      {fileName && (
        <div className="flex justify-between">
          <p className="text-md md:text-lg mb-4 md:mb-6">
            File Uploaded :{" "}
            <span title="Click to see story text" className="font-medium text-blue-500 cursor-pointer" onClick={() => setShowStoryModal(true)}>
              {fileName}
            </span>
          </p>
          <button
            className={`text-white mb-4 right-6 bg-blue-500 hover:bg-blue-300 disabled:bg-blue-300 focus:ring-4 focus:outline-none ring-danger-300 font-medium rounded-lg text-sm px-5 py-3 text-center focus:ring-primary-800`}
            onClick={addNewFields}
          >
            Add New Fields
          </button>
        </div>
      )}

      {/* body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        {/* WHO SECTION */}
        <div>
          <p className="text-center border border-2 border-violet-300 rounded-md bg-violet-50 mb-2">WHO</p>
          <div className="h-[24vh] overflow-auto border border-2 border-violet-300 bg-violet-50 px-2 md:px-3 rounded-md">
            <ul className="space-y-0 md:space-y-1 mt-3">
              {whoItems?.map((item, index) => (
                <li key={item.id}>
                  <div className="flex items-center">
                    <div
                      title={item.newName ? item.newName.length>20 ? item.newName : ""
                        : item.name.length > 20 ? item.name : ""
                      }
                      className="flex items-center w-full md:w-[18vw]"
                    >
                      <input
                        checked={item.isRadioSelected}
                        disabled={item.isCheckboxSelected}
                        onChange={() => handleWhoRadioChange(item)}
                        id={`link-radio-${index}`}
                        type="radio"
                        value={item.name}
                        title="Primary-Who"
                        className="w-4 h-4 me-3 text-green-600 border-gray-300 disabled:bg-gray-200 focus:ring-blue-500 focus:ring-2"
                      />
                      <input
                        checked={item.isCheckboxSelected}
                        disabled={item.isRadioSelected}
                        onChange={() => handleWhoCheckboxChange(item)}
                        id={`default-checkbox-${index}`}
                        type="checkbox"
                        value={item.name}
                        title="Secondary-Who"
                        className="w-4 h-4 text-blue-600 border-gray-300 disabled:bg-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`link-radio-${index}`}
                        className="ms-2 text-md"
                      >
                        <p>
                          {item.newName ? item.newName.length>20 ? item.newName.slice(0,20) + "..." : item.newName
                            :
                            item.name.length > 20
                            ? item.name.slice(0, 20) + "..."
                            : item.name
                          }
                        </p>
                      </label>
                    </div>
                    {/* edit icon */}
                    <button
                      title="Edit"
                      onClick={() => {
                        setShowEditModal(true);
                        setEditItem(item);
                        setType("who");
                      }}
                    >
                      <svg
                        className="ml-6 cursor-pointer text-gray-900 hover:text-blue-600 font-bold bi bi-pencil-square"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                    </button>

                    {/* delete icon */}
                    <button
                      title="Delete"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setDeletionItem(item);
                        setType("who");
                      }}
                    >
                      <svg
                        className="ml-6 cursor-pointer text-red-600 hover:text-red-400 font-boldbi bi-trash3"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* WHAT SECTION */}
        <div>
          <p className="text-center border border-2 border-violet-300 rounded-md  bg-violet-50 mb-2">WHAT</p>
          <div className="h-[24vh] overflow-y-auto border border-2 border-violet-300 bg-violet-50 px-2 md:px-3 rounded-md">
            <ul className="space-y-0 md:space-y-1 mt-3">
              {whatItems?.map((item, index) => (
                <li key={item.id}>
                  <div className="flex items-center">
                    <div
                      title={item.newName ? item.newName.length>20 ? item.newName : ""
                        : item.name.length > 20 ? item.name : ""
                      }                      
                      className="flex items-center w-full md:w-[18vw]"
                    >
                      <input
                        checked={item.isRadioSelected}
                        disabled={item.isCheckboxSelected}
                        onChange={() => handleWhatRadioChange(item)}
                        id={`link-radio-${index}`}
                        type="radio"
                        value={item.name}
                        title="Primary-What"
                        className="w-4 h-4 me-3 text-green-600 disabled:bg-gray-200 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <input
                        checked={item.isCheckboxSelected}
                        disabled={item.isRadioSelected}
                        onChange={() => handleWhatCheckboxChange(item)}
                        id={`default-checkbox-${index}`}
                        type="checkbox"
                        value={item.name}
                        title="Secondary-What"
                        className="w-4 h-4 text-blue-600 disabled:bg-gray-200 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`link-radio-${index}`}
                        className="ms-2 text-md"
                      >
                        <p>
                          {item.newName ? item.newName.length>20 ? item.newName.slice(0,20) + "..." : item.newName
                            :
                            item.name.length > 20
                            ? item.name.slice(0, 20) + "..."
                            : item.name
                          }
                        </p>
                      </label>
                      
                      {/* clear radio selection icon */}
                      {item.isRadioSelected &&
                        <button
                          title="Clear Selection"
                          className="ms-3 text-blue-600"
                          onClick={() => handleWhatRadioChange(item)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                          </svg>
                        </button>
                      }
                    </div>

                    {/* edit icon */}
                    <button
                      title="Edit"
                      onClick={() => {
                        setShowEditModal(true);
                        setEditItem(item);
                        setType("what");
                      }}
                    >
                      <svg
                        className="ml-6 cursor-pointer text-gray-900 hover:text-blue-600 font-bold bi bi-pencil-square"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                    </button>

                    {/* delete icon */}
                    <button
                      title="Delete"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setDeletionItem(item);
                        setType("what");
                      }}
                    >
                      <svg
                        className="ml-6 cursor-pointer text-red-600 hover:text-red-400 font-boldbi bi-trash3"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* WHERE SECTION */}
        <div>
          <p className="text-center border border-2 border-violet-300 rounded-md  bg-violet-50 mb-2">WHERE</p>
          <div className="h-[24vh] overflow-y-auto border border-2 border-violet-300 bg-violet-50 px-2 md:px-3 rounded-md">
            <ul className="space-y-0 md:space-y-1 mt-3">
              {whereItems?.map((item, index) => (
                <li key={item.id}>
                  <div className="flex items-center">
                    <div
                      title={item.newName ? item.newName.length>20 ? item.newName : ""
                        : item.name.length > 20 ? item.name : ""
                      }                      
                      className="flex items-center w-full md:w-[18vw]"
                    >
                      <input
                        checked={item.isRadioSelected}
                        disabled={item.isCheckboxSelected}
                        onChange={() => handleWhereRadioChange(item)}
                        id={`link-radio-${index}`}
                        type="radio"
                        value={item.name}
                        title="Primary-Where"
                        className="w-4 h-4 me-3 text-green-600 disabled:bg-gray-200 border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <input
                        checked={item.isCheckboxSelected}
                        disabled={item.isRadioSelected}
                        onChange={() => handleWhereCheckboxChange(item)}
                        id={`default-checkbox-${index}`}
                        type="checkbox"
                        value={item.name}
                        title="Secondary-Where"
                        className="w-4 h-4 text-blue-600 disabled:bg-gray-200 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <label
                        htmlFor={`link-radio-${index}`}
                        className="ms-2 text-md"
                      >
                        <p>
                          {item.newName ? item.newName.length>20 ? item.newName.slice(0,20) + "..." : item.newName
                            :
                            item.name.length > 20
                            ? item.name.slice(0, 20) + "..."
                            : item.name
                          }
                        </p>
                      </label>

                      {/* clear radio selection icon */}
                      {item.isRadioSelected &&
                        <button
                          title="Clear Selection"
                          className="ms-3 text-blue-600"
                          onClick={() => handleWhereRadioChange(item)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                          </svg>
                        </button>
                      }
                    </div>
                    {/* edit icon */}
                    <button
                      title="Edit"
                      onClick={() => {
                        setShowEditModal(true);
                        setEditItem(item);
                        setType("where");
                      }}
                    >
                      <svg
                        className="ml-6 cursor-pointer text-gray-900 hover:text-blue-600 font-bold bi bi-pencil-square"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path
                          fillRule="evenodd"
                          d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                        />
                      </svg>
                    </button>

                    {/* delete icon */}
                    <button
                      title="Delete"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setDeletionItem(item);
                        setType("where");
                      }}
                    >
                      <svg
                        className="ml-6 cursor-pointer text-red-600 hover:text-red-400 font-boldbi bi-trash3"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* delete modal */}
      {showDeleteModal && (
        <DeleteConfirmationDialog
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => onDelete(deletionItem)}
        />
      )}

      {/* edit modal */}
      {showEditModal && (
        <EditModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          editItemObj={editItem}
          onUpdate={onUpdate}
        />
      )}

      {/* story text */}
      {showStoryModal && (
        <StoryTextPopup
          open={showStoryModal}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      <FooterButtons
        onDiscard={handleDiscard}
        onReset={onReset}
        onSubmit={onSave}
        saveType="Ws"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ThreeWsSelection;
