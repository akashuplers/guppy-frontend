import React, { useContext, useEffect, useState } from "react";
import FooterButtons from "../FooterButtons";
import { Button, Table, message } from "antd";
import DeleteConfirmationDialog from "../../../utils/modals/DeleteConfirmationDialog";
import { StoryUploadApiContext } from "../../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../../constants/api-endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SituationActionModifyPopup from "../SituationActionModifyPopup";

const getCSVsFromList = (list_of_strings) => {
  return list_of_strings.join(", ");
};

const SituationSelection = ({ onDiscard = () => {} }) => {
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [situationSelectionItems, setSituationSelectionItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // story upload context
  const { storyUploadApiResponse, setStoryUploadApiResponse } = useContext(StoryUploadApiContext);
  const { token, story_id, storyWorld, fileName, situations, updatedSituations, primaryWhos, secondaryWhos, primaryWhats, secondaryWhats, primaryWheres, secondaryWheres } = storyUploadApiResponse;


  useEffect(() => {
    setSituationSelectionItems(updatedSituations);
  }, []);

  const bodyForSaveSituationsApi = () => {
    const updated = situationSelectionItems?.map((item) => ({
      idea: item.sentence,
      type: "Situation",
    }));
    const body = {
      story_id: story_id,
      ideas: updated,
    };
    return body;
  };

  const getUpdatedJson = (arr) => {
    if(arr && arr.length>0) {
      const updated = arr.map((item, index) => ({
        id: index + 1,
        sentence: item.idea,
        primaryWhos: primaryWhos,
        secondaryWhos: secondaryWhos,
        primaryWhats: primaryWhats,
        secondaryWhats: secondaryWhats,
        primaryWheres: primaryWheres,
        secondaryWheres: secondaryWheres,
      }));
      return updated;
    }
    return [];
  }

  const onSave = async () => {
    setIsSubmitting(true);
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.SAVE_SITUATIONS;
      const payload = bodyForSaveSituationsApi();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      message.loading("Processing...");
      const response = await axios.post(apiUrl, payload, config); // post api request
      console.log("save situations response: ", response);
      const output = response?.data;
      if(output) {
        const { actions } = output;
        
        // update context
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          updatedSituations: situationSelectionItems,
          actions: getUpdatedJson(actions),
          updatedActions: getUpdatedJson(actions),
        };
        console.log('updatedContextObj: ', updatedContextObj);
        setStoryUploadApiResponse(updatedContextObj);
        message.success("Situations Saved Successfully !");
      } else {
        message.error("Error In Saving Situations ! Unable To Fetch Response !");
      }
    } catch (error) {
      console.error("Error:", error);
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
          message.error("Error In Saving Situations ! Unable To Fetch Response !");
        }
      }
    }
    setIsSubmitting(false);
  };

  const onModify = (updatedObj) => {
    const curData = [...situationSelectionItems];
    const modified = curData.map((ele) =>
      ele.id === selectedRow.id ? updatedObj : ele
    );
    setSituationSelectionItems(modified);
    message.success("Updated Successfully !");
  };

  const onReset = () => {
    setSituationSelectionItems(situations);
    message.success("Reset Successfully !");
  };

  const handleAddRow = () => {
    const newObj = {
      id: situationSelectionItems?.length + 1,
      sentence: "",
      primaryWhos: [],
      secondaryWhos: [],
      primaryWhats: [],
      secondaryWhats: [],
      primaryWheres: [],
      secondaryWheres: [],
    };
    const curData = [newObj, ...situationSelectionItems];
    setSituationSelectionItems(curData);
    message.success("New Row Added Successfully !");
  };

  const handleDelete = () => {
    const curData = [...situationSelectionItems];
    const updated = curData.filter((ele) => ele.id !== selectedRow.id);
    setSituationSelectionItems(updated);
    message.success("Deleted Successfully !");
  };

  const situationSelectionColumns = [
    {
      dataIndex: "sentence",
      title: "Situation",
      render: (val) => {
        return (
          <p title={val?.length > 25 ? val : ""}>
            {val?.length > 25 ? val.slice(0, 25) + "..." : val}
          </p>
        );
      },
    },
    {
      dataIndex: "primaryWhos",
      title: "Primary WHOs",
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p title={csvStr?.length > 15 ? csvStr : ""}>
            {csvStr
              ? csvStr.length > 15
                ? csvStr.slice(0, 15) + "..."
                : csvStr
              : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWhos",
      title: "Secondary WHOs",
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p title={csvStr?.length > 15 ? csvStr : ""}>
            {csvStr
              ? csvStr.length > 15
                ? csvStr.slice(0, 15) + "..."
                : csvStr
              : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "primaryWhats",
      title: "Primary WHATs",
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p title={csvStr?.length > 15 ? csvStr : ""}>
            {csvStr
              ? csvStr.length > 15
                ? csvStr.slice(0, 15) + "..."
                : csvStr
              : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWhats",
      title: "Secondary WHATs",
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p title={csvStr?.length > 15 ? csvStr : ""}>
            {csvStr
              ? csvStr.length > 15
                ? csvStr.slice(0, 15) + "..."
                : csvStr
              : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "primaryWheres",
      title: "Primary WHEREs",
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p title={csvStr?.length > 15 ? csvStr : ""}>
            {csvStr
              ? csvStr.length > 15
                ? csvStr.slice(0, 15) + "..."
                : csvStr
              : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWheres",
      title: "Secondary WHEREs",
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p title={csvStr?.length > 15 ? csvStr : ""}>
            {csvStr
              ? csvStr.length > 15
                ? csvStr.slice(0, 15) + "..."
                : csvStr
              : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "action",
      title: "Action",
      render: (val, record) => {
        return (
          <div className="flex">
            {/* edit button */}
            <button
              title="View/Modify"
              onClick={() => {
                setShowModifyPopup(true);
                setSelectedRow(record);
              }}
            >
              <svg
                className="cursor-pointer hover:text-blue-600 text-gray-900 font-bold bi bi-pencil-square"
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
            {/* delete button */}
            <button
              title="Delete"
              onClick={() => {
                setShowDeleteModal(true);
                setSelectedRow(record);
              }}
            >
              <svg
                className="ml-5 cursor-pointer hover:text-red-400 text-red-600 font-boldbi bi-trash3"
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
        );
      },
    },
  ];

  return (
    <div className="px-5 pb-5 rounded-md border">
      <p className="text-lg md:text-xl font-medium mt-5 mb-3 md:mb-5">
        Step-4 : <span className="underline">Situation Selection</span>
      </p>
      <p className="text-lg md:text-xl mb-2 md:mb-4 text-violet-500">
        {storyWorld}
      </p>
      {fileName && (
        <p className="text-md md:text-lg mb-4 md:mb-6">
          File Uploaded :{" "}
          <span className="font-medium text-blue-500">
            {fileName}
          </span>
        </p>
      )}

      {/* body */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="text-lg md:text-xl underline">SITUATIONS</p>
          <Button className="bg-blue-500 text-white h-9" onClick={handleAddRow}>
            ADD NEW
          </Button>
        </div>
        <div className="overflow-auto">
          <Table
            dataSource={situationSelectionItems}
            columns={situationSelectionColumns}
          />
        </div>
      </div>

      {/* modify popup */}
      {showModifyPopup && (
        <SituationActionModifyPopup
          open={showModifyPopup}
          modifyItemObj={selectedRow}
          onClose={() => setShowModifyPopup(false)}
          onModify={onModify}
          type="situation"
        />
      )}

      {/* modify popup */}
      {showDeleteModal && (
        <DeleteConfirmationDialog
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      <FooterButtons
        onDiscard={onDiscard}
        onReset={onReset}
        onSubmit={onSave}
        saveType="Situations"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default SituationSelection;