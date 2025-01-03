import React from 'react';
import { Input, Checkbox, Button } from 'antd'; 
import { SearchOutlined } from '@ant-design/icons'; 

export const generateFilterDropdown = (storyUploadApiResponse, selectedKeys, setSelectedKeys, confirm, clearFilters, placeholder) => {
    return (
      <div className="p-2 w-52">
        <Input
          placeholder={placeholder}
          value={selectedKeys[0] || ""}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          className="p-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none mb-2 w-full"
        />
        <div className="max-h-48 overflow-y-auto">
         { console.log("storyUploadApiResponse",storyUploadApiResponse)}
          
         {storyUploadApiResponse
  .filter((item) => {
    // Check if item is a string before calling .toLowerCase()
    const itemValue = typeof item === "string" ? item.toLowerCase() : "";
    return itemValue.includes((selectedKeys[0]?.toLowerCase() || ""));
  })
  .map((item) => (
    <div key={item}>
      <Checkbox
        value={item}
        checked={selectedKeys.includes(item)}
        onChange={() => {
          const newSelectedKeys = selectedKeys.includes(item)
            ? selectedKeys.filter((key) => key !== item)
            : [...selectedKeys, item];
          setSelectedKeys(newSelectedKeys);
        }}
      >
        {item}
      </Checkbox>
    </div>
  ))}

        </div>
        <div className="mt-2">
          <Button
            icon={<SearchOutlined />}
            size="small"
            className="w-20 bg-blue-400 hover:bg-blue-300 text-sm mr-2"
            onClick={() => {
              confirm();
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && clearFilters()}
            size="small"
            className="w-20 bg-gray-200 hover:bg-gray-300 text-sm"
          >
            Reset
          </Button>
        </div>
      </div>
    );
  };