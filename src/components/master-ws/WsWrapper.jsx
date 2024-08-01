import EditIcon from "../../utils/icons/EditIcon";
import { useEffect, useState } from "react";
import SingleFieldEditModal from "../../utils/modals/SingleFieldEditModal";
import { Button, message } from "antd";

const WsWrapper = ({list, type}) => {
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [wsList, setWsList] = useState([]);
  const [editItemObj, setEditItemObj] = useState({});
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    setWsList(list);
  }, [list]);

  const onUpdate = (updatedValue) => {
    if(modalType === 'Edit') {
        const updatedList = wsList.map((ele) => ele===editItemObj ? {...ele, value: updatedValue} : ele);
        setWsList(updatedList);
        message.success("Updated Successfully");
    } else {
        const current = [...wsList];
        const newItem = {
            type: type?.toLowerCase()?.includes('primary') ? 'Primary' : 'Secondary',
            value: updatedValue
        }
        const updatedList = [ newItem, ...current];
        setWsList(updatedList);
        message.success("Added Successfully");
    }
  }
  
  return (
    <>
        {wsList?.length > 0 ?
            <div className='mb-6 md:mb-8'>
                <div className="flex justify-between items-center mb-5">
                    <p className="text-black font-medium text-lg md:text-xl">{type}</p>
                    <Button
                        type="primary"
                        className="bg-blue-50 border-blue-500 text-blue-500"
                        onClick={() => setShowEditModal(true)}
                    >
                        + Add {type}
                    </Button>
                </div>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-3 gap-x-2 md:gap-x-3 lg:gap-x-4"
                >
                    {wsList?.map((item, index) => (
                        <div
                            key={index}
                            style={{ borderRadius: "5px" }}
                            className='py-1 px-2 flex items-center border border-gray-300 bg-gray-50'
                        >
                            <div className='w-full md:w-[22vw]'>
                                <p className='lg:text-lg'>
                                    {item.value}
                                </p>
                            </div>

                            <div
                                onClick={() => {
                                    setShowEditModal(true);
                                    setEditItemObj(item);
                                    setEditItem(item.value);
                                    setModalType("Edit");
                                }}
                            >
                                <EditIcon className={'me-2'} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            :
            <p className='text-md p-1 bg-gray-50 text-center border rounded-md font-medium mb-5'>
                {`${type} Not Found !`}
            </p>

        }

        {/* edit modal */}
        {showEditModal && (
            <SingleFieldEditModal
                open={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditItem('');
                    setModalType('');
                }}
                editItem={editItem}
                onUpdate={onUpdate}
                type={modalType}
                field={type?.slice(0, type?.length-1)}
            />
        )}
    </>
  )
}

export default WsWrapper