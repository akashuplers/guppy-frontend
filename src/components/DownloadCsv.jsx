import { CSVLink } from "react-csv";

const DownloadCSVFile = (props) => {

  const headers = [
    { label: "W's Form", key: "ws" },
    { label: "Type", key: "type" },
    { label: "Cluster Head", key: "ClusterHead" },
    { label: "Cluster Value", key: "ClusterValue" }
  ];
  
    return (
        <>
      <CSVLink
        data={props?.csvDat} 
        headers={headers} 
        filename={'storyworld_storyFilename.csv'} 
      >
        Download
      </CSVLink>     
        </>
    )
}

export default DownloadCSVFile;
