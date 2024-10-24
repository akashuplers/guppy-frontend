import React, { useContext, useEffect, useState } from "react";
import FooterButtons from "../FooterButtons";
import { Button, Table, message } from "antd";
import DeleteConfirmationDialog from "../../../utils/modals/DeleteConfirmationDialog";
import { StoryUploadApiContext } from "../../../contexts/ApiContext";
import { API_BASE_PATH, API_ROUTES } from "../../../constants/api-endpoints";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModifySelectionPopup from "../ModifySelectionPopup";
import StoryTextPopup from "../StoryTextPopup";
import SingleTextAreaModal from "../../../utils/modals/SingleTextAreaModal";
import "../table.css";

const getCSVsFromList = (list_of_strings) => {
  return list_of_strings.join(", ");
};

const ActionSelection = ({ onDiscard = () => {} }) => {
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [actionSelectionItems, setActionSelectionItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');
  const [modalType, setModalType] = useState('');
  const navigate = useNavigate();

  // story upload context
  const { storyUploadApiResponse, setStoryUploadApiResponse } = useContext(StoryUploadApiContext);
  const { token, story_id, storyWorld, fileName, actions, updatedActions, primaryWhos } = storyUploadApiResponse;

  useEffect(() => {
    setActionSelectionItems(updatedActions);
  }, []);

  const onUpdate = (updatedValue) => {
    const updatedRow = {...selectedRow, comment: updatedValue};
    const current = [...actionSelectionItems];
    const updated = current.map((row) => row?.id===selectedRow?.id ? updatedRow : row);
    setActionSelectionItems(updated);
    if(modalType === 'Edit') {
      message.success("Comment Updated Successfully");
    } else {
      message.success("Comment Added Successfully");
    }
  }

  const bodyForSaveActionsApi = () => {
    const updated = actionSelectionItems?.map((item) => ({
      idea: item.sentence,
      Classification: "Action",
      Who_Primary: item.primaryWhos,
      Who_Secondary: item.secondaryWhos,
      What_Primary: item.primaryWhats,
      What_Secondary: item.secondaryWhats,
      Where_Primary: item.primaryWheres,
      Where_Secondary: item.secondaryWheres,
    }));
    const body = {
      story_id: story_id,
      ideas: updated,
    };
    return body;
  };

  const onSave = async () => {
    setIsSubmitting(true);
    let alertKey;
    try {
      // api call
      const apiUrl = API_BASE_PATH + API_ROUTES.SAVE_ACTIONS;
      const payload = bodyForSaveActionsApi();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      alertKey = message.loading("Saving Actions...", 0).key;
      const response = await axios.post(apiUrl, payload, config); // post api request
      const output = response?.data;
      if(output) {
        // update context
        const contextObj = { ...storyUploadApiResponse };
        const updatedContextObj = {
          ...contextObj,
          updatedActions: actionSelectionItems,
        };
        setStoryUploadApiResponse(updatedContextObj);
        message.destroy(alertKey);
        message.success("Actions Saved Successfully !");
      } else {
        message.error("Error In Saving Actions ! Unable To Fetch Response !");
      }
    } catch (error) {
      console.error("Error:", error);
      message.destroy(alertKey);
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
          message.error("Error In Saving Actions ! Unable To Fetch Response !");
        }
      }
    }
    setIsSubmitting(false);
  };

  const onModify = (updatedObj) => {
    const curData = [...actionSelectionItems];
    const modified = curData.map((ele) =>
      ele.id === selectedRow.id ? updatedObj : ele
    );
    setActionSelectionItems(modified);
    message.success("Updated Successfully !");
  };

  const onReset = () => {
    setActionSelectionItems(actions);
    message.success("Reset Successfully !");
  };

  const handleAddRow = () => {
    const newObj = {
      id: actionSelectionItems?.length + 1,
      sentence: "",
      primaryWhos,
      secondaryWhos: [],
      primaryWhats: [],
      secondaryWhats: [],
      primaryWheres: [],
      secondaryWheres: [],
    };
    const curData = [newObj, ...actionSelectionItems];
    setActionSelectionItems(curData);
    message.success("New Row Added Successfully !");
  };

  const handleDelete = () => {
    const curData = [...actionSelectionItems];
    const updated = curData.filter((ele) => ele.id !== selectedRow.id);
    setActionSelectionItems(updated);
    message.success("Deleted Successfully !");
  };

  const actionSelectionColumns = [
    {
      dataIndex: "sentence",
      title: <p className="text-center">Action</p>,
      width: 430,
      align: 'justify',
    },
    {
      dataIndex: "primaryWhos",
      title: <p className="text-center">Primary WHOs</p>,
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWhos",
      title: <p className="text-center">Secondary WHOs</p>,
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "primaryWhats",
      title: <p className="text-center">Primary WHATs</p>,
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWhats",
      title: <p className="text-center">Secondary WHATs</p>,
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "primaryWheres",
      title: <p className="text-center">Primary WHEREs</p>,
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "secondaryWheres",
      title: <p className="text-center">Secondary WHEREs</p>,
      render: (val) => {
        const csvStr = getCSVsFromList(val);
        return (
          <p>
            {csvStr ? csvStr : "NA"}
          </p>
        );
      },
    },
    {
      dataIndex: "comment",
      title: <p className="text-center">Comment</p>,
      render: (val, record) => {
        return (
          <p
            className={`cursor-pointer hover:text-blue-600 ${!val && "text-blue-600 underline"}`}
            onClick={() => {
              setSelectedRow(record);
              setShowCommentModal(true);
              setModalType(val ? 'Edit' : '');
              setComment(val ? val : '');
            }}
          >
            {val ?
            // "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur quasi soluta laudantium eum enim maiores aperiam eligendi officia nihil fugit neque cupiditate omnis dicta, perspiciatis porro magnam fugiat quaerat doloribus."
            val
            :
            "+ Add Comment"
            }
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
      <div className="text-lg flex flex-col md:flex-row justify-between md:text-xl mt-5 mb-3 md:mb-4">
        <p>Step-5 : Action Selection</p>
        <p className="text-lg md:text-xl mt-2 md:mt-0">
          Story World : <span className="text-violet-500">{storyWorld}</span>
        </p>
      </div>

      {fileName && (
        <p className="text-md md:text-lg mb-4 md:mb-6">
          File Uploaded :{" "}
          <span title="Click to see story text" className="font-medium text-blue-500 cursor-pointer" onClick={() => setShowStoryModal(true)} >
            {fileName}
          </span>
        </p>
      )}

      {/* body */}
      <div>
        <div className="flex justify-end items-center mb-3">
          <Button className="bg-blue-500 text-white h-9" onClick={handleAddRow}>
            ADD NEW
          </Button>
        </div>
        <div className="overflow-auto">
          <Table
            dataSource={actionSelectionItems}
            columns={actionSelectionColumns}
            bordered
            className="custom-table"
          />
        </div>
      </div>

      {/* modify popup */}
      {showModifyPopup && (
        <ModifySelectionPopup
          open={showModifyPopup}
          modifyItemObj={selectedRow}
          onClose={() => setShowModifyPopup(false)}
          onModify={onModify}
          type="action"
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

      {/* story text */}
      {showStoryModal && (
        <StoryTextPopup
          open={showStoryModal}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {/* add comment modal */}
      {showCommentModal && (
        <SingleTextAreaModal
          open={showCommentModal}
          type={modalType}
          label="Comment"
          editItem={comment}
          onUpdate={onUpdate}
          onClose={() => {
            setShowCommentModal(false);
            setComment('');
            setModalType('');
          }}
        />
      )}

      <FooterButtons
        onDiscard={onDiscard}
        onReset={onReset}
        onSubmit={onSave}
        saveType="Actions"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ActionSelection;