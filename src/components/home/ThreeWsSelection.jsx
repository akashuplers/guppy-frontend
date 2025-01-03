import React, { useRef, useContext, useEffect, useState } from "react";
import FooterButtons from "./FooterButtons";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import DeleteConfirmationDialog from "../../utils/modals/DeleteConfirmationDialog";
import { message } from "antd";
import EditModal from "./EditModal";
import { StoryUploadApiContext } from "../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../constants/api-endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StoryTextPopup from "./StoryTextPopup";

const ThreeWsSelection = ({ onDiscard = () => {}, saveWs, handleSaveSuccess = () => {}}) => {
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
  const [selectedPrimaryWho, setSelectedPrimaryWho] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const scrollableWhoDivRef = useRef(null);
  const scrollableWhatDivRef = useRef(null);
  const scrollableWhereDivRef = useRef(null);

  // story upload context
  const { storyUploadApiResponse, setStoryUploadApiResponse, handleAnythingChanged } = useContext(StoryUploadApiContext);
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
    const selectedId = updatedWhos.find(item => item.isCheckboxSelected === true)?.id;
    setSelectedPrimaryWho(selectedId);

  }, [storyUploadApiResponse, isSaved]);

  useEffect(() => {
    if(saveWs){
      onSave();
    }
  }, [saveWs]);

  const handleWhoCheckboxChange = (item) => {
    const name = item?.newName ?? item?.name;
    if (item.isCheckboxSelected) {
      const filteredArr = secondaryWhos.filter(
        (ele) => ele.toLowerCase() !== name.toLowerCase()
      );
      setSecondaryWhos(filteredArr);
    } else {
      setSecondaryWhos([...secondaryWhos, name]);
    }
    const updatedItem = {
      ...item,
      isCheckboxSelected: !item.isCheckboxSelected,
    };
    const updatedArr = whoItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhoItems(updatedArr);
    handleAnythingChanged(true);
  };

  const handleWhatCheckboxChange = (item) => {
    const name = item?.newName ?? item?.name;
    if (item.isCheckboxSelected) {
      const filteredArr = secondaryWhats.filter(
        (ele) => ele.toLowerCase() !== name.toLowerCase()
      );
      setSecondaryWhats(filteredArr);
    } else {
      setSecondaryWhats([...secondaryWhats, name]);
    }
    const updatedItem = {
      ...item,
      isCheckboxSelected: !item.isCheckboxSelected,
    };
    const updatedArr = whatItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhatItems(updatedArr);
    handleAnythingChanged(true);
  };

  const handleWhereCheckboxChange = (item) => {
    const name = item?.newName ?? item?.name;
    if (item.isCheckboxSelected) {
      const filteredArr = secondaryWheres.filter(
        (ele) => ele.toLowerCase() !== name.toLowerCase()
      );
      setSecondaryWheres(filteredArr);
    } else {
      setSecondaryWheres([...secondaryWheres, name]);
    }
    const updatedItem = {
      ...item,
      isCheckboxSelected: !item.isCheckboxSelected,
    };
    const updatedArr = whereItems.map((ele) =>
      ele.id === item.id ? updatedItem : ele
    );
    setWhereItems(updatedArr);
    handleAnythingChanged(true);
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
    handleAnythingChanged(true);
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
    handleAnythingChanged(true);
  };

  const onReset = () => {
    resetAll();
    message.success("Reset Successfully !");
    handleAnythingChanged(true);
  };

  const getUpdatedJson = (arr) => {
    if(arr && arr.length>0) {
      const updated = arr.map((item, index) => ({
        id: item.id,
        title: item.Title,
        primaryWhos: item.Who_Primary,
        secondaryWhos: item.Who_Secondary,
        primaryWhats: item.What_Primary,
        secondaryWhats: item.What_Secondary,
        primaryWheres: item.Where_Primary,
        secondaryWheres: item.Where_Secondary,
        comment: item.comment
      }));
      return updated;
    }
    return [];
  }

  const getWhoValues = (whoResponse) => {
    return whoResponse.map(who => {
      const whoItem = whoItems.find(item => 
        item.newName ? item.newName === who.value : item.name === who.value
      );

      return {
        id: who.id,
        isCheckboxSelected: whoItem.isCheckboxSelected ?? false,
        name: who.value
      }
    })
  }

  const getWhatValues = (whatResponse) => {
    return whatResponse.map(what => {
      const whatItem = whatItems.find(item => 
        item.newName ? item.newName === what.value : item.name === what.value
      );
      
      return {
        id: what.id,
        isCheckboxSelected: whatItem.isCheckboxSelected ?? false,
        name: what.value
      }
    })
  }

  const getWhereValues = (whereResponse) => {
    return whereResponse.map(where => {
      const whereItem = whereItems.find(item => 
        item.newName ? item.newName === where.value : item.name === where.value
      );
      
      return {
        id: where.id,
        isCheckboxSelected: whereItem.isCheckboxSelected ?? false,
        name: where.value
      }
    })
  }
  const onSave = async () => {
    setIsSubmitting(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.SELECT_Ws;
      const payload = bodyForSaveWsApi();
      
      console.log('payload',payload);

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
        const { titles, updatedWs } = output;
        const { ws_data } = updatedWs;
        setWhoItems(getWhoValues(ws_data.Who));
        setWhatItems(getWhatValues(ws_data.What));
        setWhereItems(getWhereValues(ws_data.Where));
        // update context
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          // primaryWhos,
          // secondaryWhos,
          // primaryWhats,
          // secondaryWhats,
          // primaryWheres,
          // secondaryWheres,
          titles: getUpdatedJson(titles),
          updatedTitles: getUpdatedJson(titles),
          updatedWhos: getWhoValues(ws_data.Who),
          updatedWhats: getWhatValues(ws_data.What),
          updatedWheres: getWhereValues(ws_data.Where),
        };

        setStoryUploadApiResponse(updatedContextObj);
        setIsSaved(true);

        message.destroy(alertKey); // stop infinite loader alert
        message.success("Ws Saved Successfully !");
        handleSaveSuccess(true);
        handleAnythingChanged(false);

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

  const createWsArray = (wsList) => {
    let updated = wsList?.map((item) => {if(item.isNewField){ return {
      selected:item.isCheckboxSelected ? true : false,
      value: item.newName ?? item.name,
      id: '',
      new: true,
      updated: false,
      ner: item.ner ?? false,
    }
  } else {
      return {
        selected:item.isCheckboxSelected ? true : false,
        value: item.name,
        newValue: item.newName,
        updated: item.newName !== undefined,
        ner: item.ner ?? false,
        id: item.id ?? ''
      }
    }});
    return updated;
  };

  const addNewWho = (event) => {
    if (scrollableWhoDivRef.current) {
      scrollableWhoDivRef.current.scrollTop = 0;
    }
    event.currentTarget.blur();
    const newField = {
      isCheckboxSelected: false,
      name: "text",
      isNewField: true
    };
    
    setWhoItems((prev) => [{id: whoItems.length + 1, ...newField}, ...prev]);
    handleAnythingChanged(true);
  };

  const addNewWhat = (event) => {
    if (scrollableWhatDivRef.current) {
      scrollableWhatDivRef.current.scrollTop = 0;
    }
    event.currentTarget.blur();
    const newField = {
      isCheckboxSelected: false,
      name: "text",
      isNewField: true
    };
    
    setWhatItems((prev) => [{id: whatItems.length + 1, ...newField}, ...prev]);
    handleAnythingChanged(true);
  };

  const addNewWhere = (event) => {
    if (scrollableWhereDivRef.current) {
      scrollableWhereDivRef.current.scrollTop = 0;
    }
    event.currentTarget.blur();
    const newField = {
      isCheckboxSelected: false,
      name: "text",
      isNewField: true
    };

    setWhereItems((prev) => [{id: whereItems.length + 1, ...newField}, ...prev]);
    handleAnythingChanged(true);
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

  
  const onDragStart = (evt, itemId) => {
    evt.dataTransfer.setData("text/plain", itemId);
  };

  const onDragEnd = (evt) => {
    evt.currentTarget.classList.remove("dragged");
  };

  const onDragEnter = (evt) => {
    evt.preventDefault();
    const element = evt.currentTarget;
    element.classList.add("dragged-over"); 
    evt.dataTransfer.dropEffect = "move"; 
  };

  const onDragLeave = (evt) => {
    const element = evt.currentTarget;
    element.classList.remove("dragged-over"); 
  };

  const onDragOver = (evt) => {
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "move";
  };

 const onDrop = (evt, target) => {
   evt.preventDefault();
   const data = evt.dataTransfer.getData("text/plain"); 
   let draggedItem;
   let sourceItems = [];
   let setSourceItems = () => {}; 
   if (whoItems.some(item => item.id.toString() === data)) {
     draggedItem = whoItems.find((item) => item.id.toString() === data);
     sourceItems = whoItems;
     setSourceItems = setWhoItems;
   } else if (whatItems.some(item => item.id.toString() === data)) {
     draggedItem = whatItems.find((item) => item.id.toString() === data);
     sourceItems = whatItems;
     setSourceItems = setWhatItems;
   } else if (whereItems.some(item => item.id.toString() === data)) {
     draggedItem = whereItems.find((item) => item.id.toString() === data);
     sourceItems = whereItems;
     setSourceItems = setWhereItems;
   }
   if (draggedItem) {
     const updatedSourceItems = sourceItems.filter((item) => item.id !== draggedItem.id);
     setSourceItems(updatedSourceItems); 
     if (target === "what") {
       setWhatItems((prevItems) => [...prevItems, draggedItem]);
     } else if (target === "where") {
       setWhereItems((prevItems) => [...prevItems, draggedItem]);
     } else if (target === "who") {
       setWhoItems((prevItems) => [...prevItems, draggedItem]);
     }
   }
 };

 const [sortOrder, setSortOrder] = useState("");

 const handleSort = (title, direction) => {
   const sortItems = (items) => {
     return items.sort((a, b) => {
       if (a.name.toLowerCase() < b.name.toLowerCase())
         return direction === "asc" ? -1 : 1;
       if (a.name.toLowerCase() > b.name.toLowerCase())
         return direction === "asc" ? 1 : -1;
       return 0;
     });
   };

   if (title === "who") {
     setWhoItems(sortItems([...whoItems]));
   } else if (title === "what") {
     setWhatItems(sortItems([...whatItems]));
   } else {
     setWhereItems(sortItems([...whereItems]));
   }

   setSortOrder(direction);
 };

 const SortIcons = ({ field, sortOrder, handleSort }) => {
  return (
    <div className="flex items-center">
      <ChevronUpIcon
        className={`h-5 w-5 cursor-pointer ${
          sortOrder === "asc" ? "text-blue-500" : "text-violet-500"
        }`}
        title="Ascending"
        onClick={() => handleSort(field, "asc")}
      />
      <ChevronDownIcon
        className={`h-5 w-5 cursor-pointer ${
          sortOrder === "desc" ? "text-blue-500" : "text-violet-500"
        }`}
        title="Descending"
        onClick={() => handleSort(field, "desc")}
      />
    </div>
  );
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
        </div>
      )}

      {/* body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        {/* WHO SECTION */}
        <div>
          <div className="flex items-center justify-between mb-2">
          <p className="flex-grow text-center mr-2 border border-2 border-violet-300 rounded-md bg-violet-50 px-4 flex items-center justify-between">
          WHO
          <SortIcons field="who" sortOrder={sortOrder} handleSort={handleSort} />
            </p>
            <button
              className={`text-white bg-blue-500 hover:bg-blue-300 disabled:bg-blue-300 focus:ring-4 focus:outline-none ring-danger-300 font-medium rounded-lg text-sm px-2 py-2 text-center focus:ring-primary-800`}
              onClick={addNewWho}
            >
              Add New Who
            </button>
          </div>

          <div 
            ref={scrollableWhoDivRef} 
            className="h-[24vh] overflow-auto border border-2 border-violet-300 bg-violet-50 px-2 md:px-3 rounded-md"
            onDragLeave={onDragLeave}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, 'who')}>
            <ul className="mt-3 space-y-0 md:space-y-1">
              {whoItems?.map((item, index) => (
                <li key={item.id} draggable onDragStart={(e) => onDragStart(e, item.id)} onDragEnd={onDragEnd}  // Pass item id to onDragStart
               >
                  <div className="flex items-center">
                    <div
                      title={item.newName ? item.newName.length>20 ? item.newName : ""
                        : item.name.length > 20 ? item.name : ""
                      }
                      className="flex items-center w-full md:w-[18vw]"
                    >
                      
                      <input
                        checked={item.isCheckboxSelected}
                        
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
        <div>
          <div className="flex items-center justify-between mb-2">
          <p className="flex-grow text-center mr-2 border border-2 border-violet-300 rounded-md bg-violet-50 px-4 flex items-center justify-between">
            WHAT
            <SortIcons field="what" sortOrder={sortOrder} handleSort={handleSort} />
            </p>
            <button
              className={`text-white bg-blue-500 hover:bg-blue-300 disabled:bg-blue-300 focus:ring-4 focus:outline-none ring-danger-300 font-medium rounded-lg text-sm px-2 py-2 text-center focus:ring-primary-800`}
              onClick={addNewWhat}
            >
              Add New What
            </button>
          </div>
          <div 
            ref={scrollableWhatDivRef} 
            className="h-[24vh] overflow-y-auto border border-2 border-violet-300 bg-violet-50 px-2 md:px-3 rounded-md"
            onDragLeave={onDragLeave}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, 'what')}
            >
            <ul className="mt-3 space-y-0 md:space-y-1">
              {whatItems?.map((item, index) => (
                <li key={item.id} draggable onDragStart={(e) => onDragStart(e, item.id)} onDragEnd={onDragEnd}>
                  <div className="flex items-center">
                    <div
                      title={item.newName ? item.newName.length>20 ? item.newName : ""
                        : item.name.length > 20 ? item.name : ""
                      }                      
                      className="flex items-center w-full md:w-[18vw]"
                    >
                     
                      <input
                        checked={item.isCheckboxSelected}
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
                    </div>
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
        <div>
          <div className="flex items-center justify-between mb-2">
          <p className="flex-grow text-center mr-2 border border-2 border-violet-300 rounded-md bg-violet-50 px-4 flex items-center justify-between">
            WHERE
            <SortIcons field="where" sortOrder={sortOrder} handleSort={handleSort} />
            </p>
            <button
              className={`text-white bg-blue-500 hover:bg-blue-300 disabled:bg-blue-300 focus:ring-4 focus:outline-none ring-danger-300 font-medium rounded-lg text-sm px-2 py-2 text-center focus:ring-primary-800`}
              onClick={addNewWhere}
            >
              Add New Where
            </button>
          </div>
          <div 
            ref={scrollableWhereDivRef} 
            className="h-[24vh] overflow-y-auto border border-2 border-violet-300 bg-violet-50 px-2 md:px-3 rounded-md"
            onDragLeave={onDragLeave}
            onDragEnter={onDragEnter}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, 'where')}
            >
            <ul className="mt-3 space-y-0 md:space-y-1">
              {whereItems?.map((item, index) => (
                <li key={item.id} draggable onDragStart={(e) => onDragStart(e, item.id)} onDragEnd={onDragEnd}>
                  <div className="flex items-center">
                    <div
                      title={item.newName ? item.newName.length>20 ? item.newName : ""
                        : item.name.length > 20 ? item.name : ""
                      }                      
                      className="flex items-center w-full md:w-[18vw]"
                    >
                      
                      <input
                        checked={item.isCheckboxSelected}
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