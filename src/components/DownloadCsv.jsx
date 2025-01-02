import { CSVLink } from "react-csv";

const DownloadCSVFile = (props) => {

  const headers = [
    { label: "W's Form", key: "ws" },
    { label: "Type", key: "type" },
    { label: "Cluster Head", key: "ClusterHead" },
    { label: "Cluster Value", key: "clusterValues" }
  ];

  const fileNameWithCSV = props?.fileName?.replace(/\.txt$/, ".csv"); // Replace .txt with .csv
  
    return (
        <>
      <CSVLink
        data={props?.csvDat} 
        headers={headers} 
        filename={props?.storyWorld + '_' + fileNameWithCSV} 
      >
        Download
      </CSVLink>     
        </>
    )
}

export default DownloadCSVFile;
