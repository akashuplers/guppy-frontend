import { useEffect, useState } from "react"
import WsWrapper from "./WsWrapper";

const WsList = ({ list, type }) => {
  
  const [primaryWs, setPrimaryWs] = useState([]);
  const [secondaryWs, setSecondaryWs] = useState([]);

  useEffect(() => {
    const primArr = list.filter(ele => ele.type.toLowerCase()==="primary");
    setPrimaryWs(primArr);
    const secArr = list.filter(ele => ele.type.toLowerCase()==="secondary");
    setSecondaryWs(secArr);
  }, [list])
  
  return (
    <div className="mt-4">
        <WsWrapper list={primaryWs} type={`Primary ${type}`} />
        <WsWrapper list={secondaryWs} type={`Secondary ${type}`} />
    </div>
  )
}

export default WsList