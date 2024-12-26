import { CSVLink } from "react-csv";

const DownloadCSVFile = (props) => {
  const flattenData = (props.csvDat || []).map(item => ({
    ws: item.ws,  // Directly mapping the 'ws' field
    type: item.type,  // Mapping the 'type' field
    "Cluster Head": item.masterHead?.value,  // Flattening 'masterHead' and getting its 'value'
    "Cluster Value": item.clusterValue?.map(val => val.value).join(", ")  // Flattening 'clusterValue' array and joining values with commas
  }));

  // Headers should match the keys in the flattened data
  const headers = [
    { label: "W's Form", key: "ws" },
    { label: "Type", key: "type" },
    { label: "Cluster Head", key: "Cluster Head" },
    { label: "Cluster Value", key: "Cluster Value" }
  ];
    return (
        <>
      <CSVLink
        data={flattenData} 
        headers={headers} 
        filename={'storyworld_storyFilename.csv'} 
      >
        Download
      </CSVLink>     
        </>
    )
}

export default DownloadCSVFile;
