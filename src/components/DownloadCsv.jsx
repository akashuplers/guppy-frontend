import { CSVLink } from "react-csv";

const DownloadCSVFile = (props) => {


    return (
        <>
      <CSVLink
        data={props?.csvDat} 
        headers={props?.header} 
        filename={'Clusters.csv'} 
      >
        Download
      </CSVLink>     
        </>
    )
}


export default DownloadCSVFile;
