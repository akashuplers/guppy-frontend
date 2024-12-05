import { useState } from "react";

const JsonBody = (jsonData) => {
  const data = JSON.parse(jsonData.data);

  const [situationData, setSituationData] = useState([]);
  const [actionData, setActionData] = useState([]);

  const filterSituationsAndActions = () => {
    let situations = [];
    let actions = [];
    data.Ideas.updatedIdeas.forEach((ideaItem) => {
      if(ideaItem.Classification === "Action")
        actions.push(ideaItem);
      else
        situations.push(ideaItem);
    })
    setSituationData(situations);
    setActionData(actions);
  }

  useState(() => {
    filterSituationsAndActions();
  },[])

  return (
    <div style={{ minWidth: '50vh', overflowX: 'auto', backgroundColor: 'white' }}>
      <p className="font-medium mb-2">
        Story World : {data.StoryWorld}
      </p>
      <p className="font-medium mb-1 mt-6">MASTER Ws :</p>
      <div className="flex-row ml-16">
        <p>Who Primary :</p>
        <ul className="ps-8 ml-12 mb-2">
          {data.master_ws.Who.primary.length > 0 ? data.master_ws.Who.primary.map((item, index) => (
            <li className="list-disc" key={index}>{item.value}</li>
          )): <div>No Items</div>}
        </ul>
        <p>Who Secondary :</p>
        <ul className="ps-8 ml-12 mb-2">
          {data.master_ws.Who.secondary.length > 0 ? data.master_ws.Who.secondary.map((item, index) => (
            <li className="list-disc" key={index}>{item.value}</li>
          )) : <div>No Items</div>}
        </ul>
        <p>What Primary :</p>
        <ul className="ps-8 ml-12 mb-2">
          {data.master_ws.What.primary.length > 0 ? data.master_ws.What.primary.map((item, index) => (
            <li className="list-disc" key={index}>{item.value}</li>
          )): <div>No Items</div>}
        </ul>
        <p>What Secondary :</p>
        <ul className="ps-8 ml-12 mb-2">
          {data.master_ws.What.secondary.length > 0 ? data.master_ws.What.secondary.map((item, index) => (
            <li className="list-disc" key={index}>{item.value}</li>
          )): <div>No Items</div>}
        </ul>
        <p>Where Primary :</p>
        <ul className="ps-8 ml-12 mb-2">
          {data.master_ws.Where.primary.length > 0 ? data.master_ws.Where.primary.map((item, index) => (
            <li className="list-disc" key={index}>{item.value}</li>
          )): <div>No Items</div>}
        </ul>
        <p>Where Secondary :</p>
        <ul className="ps-8 ml-12 mb-2">
          {data.master_ws.Where.secondary.length > 0 ? data.master_ws.Where.secondary.map((item, index) => (
            <li className="list-disc" key={index}>{item.value}</li>
          )): <div>No Items</div>}
        </ul>
      </div>

      <p className="mt-6 mb-3 font-medium">TITLES :</p>
      {data.Title.updatedTitles.length > 0 ? data.Title.updatedTitles.map((titleItem, index) => (
        <div key={index} className="flex-row ml-12 mb-2">
          <p className="mb-2 font-medium">{`${index+1}. ${titleItem.title ?? 'No Title'}`}</p>
          <div className="flex-row ml-12">
            <p>Who Primary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {titleItem.ws.Who_Primary.length > 0 ? titleItem.ws.Who_Primary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
            </ul>
            <p>Who Secondary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {titleItem.ws.Who_Secondary.length > 0 ? titleItem.ws.Who_Secondary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )): <div>No Items</div>}
            </ul>
            <p>What Primary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {titleItem.ws.What_Primary.length > 0 ? titleItem.ws.What_Primary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
            </ul>
            <p>What Secondary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {titleItem.ws.What_Secondary.length > 0 ? titleItem.ws.What_Secondary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )): <div>No Items</div>}
            </ul>
            <p>Where Primary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {titleItem.ws.Where_Primary.length > 0 ? titleItem.ws.Where_Primary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )): <div>No Items</div>}
            </ul>
            <p>Where Secondary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {titleItem.ws.Where_Secondary.length > 0 ? titleItem.ws.Where_Secondary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )): <div>No Items</div>}
            </ul>
          </div>
        </div>
      )) : <div>No Titles! Save Ws in Previous Page to find Titles</div>
      }

      <p className="mt-6 mb-3 font-medium">SITUATIONS :</p>
      {situationData.length > 0 ? situationData.map((ideaItem, index) => (
      <>
        <p className="mb-2 font-medium">Idea: {`${index + 1}. ${ideaItem.idea ?? 'No Idea'} `}</p>
        <div key={index} className="flex-row ml-12 mb-2">
          <div className="flex-row ml-12">
            <p>Who Primary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {ideaItem.ws.Who_Primary.length > 0 ? ideaItem.ws.Who_Primary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              )) : <div>No Items</div>}
            </ul>
            <p>Who Secondary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {ideaItem.ws.Who_Secondary.length > 0 ? ideaItem.ws.Who_Secondary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              )) : <div>No Items</div>}
            </ul>
            <p>What Primary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {ideaItem.ws.What_Primary.length > 0 ? ideaItem.ws.What_Primary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              )) : <div>No Items</div>}
            </ul>
            <p>What Secondary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {ideaItem.ws.What_Secondary.length > 0 ? ideaItem.ws.What_Secondary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              )) : <div>No Items</div>}
            </ul>
            <p>Where Primary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {ideaItem.ws.Where_Primary.length > 0 ? ideaItem.ws.Where_Primary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              )) : <div>No Items</div>}
            </ul>
            <p>Where Secondary:</p>
            <ul className="ps-8 ml-12 mb-2">
              {ideaItem.ws.Where_Secondary.length > 0 ? ideaItem.ws.Where_Secondary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              )) : <div>No Items</div>}
            </ul>
          </div>
        </div>
      </>
      )) : <div>No Situations! Save Titles in Previous Page to find Situations</div>
      }

      <p className="mt-6 mb-3 font-medium">ACTIONS :</p>
      {actionData.length > 0 ? actionData.map((ideaItem, index) => (
        <>
          <p className="mb-2 font-medium">Idea: {`${index + 1}. ${ideaItem.idea ?? 'No Idea'}`}</p>
          <div key={index} className="flex-row ml-12 mb-2">
            <div className="flex-row ml-12">
              <p>Who Primary:</p>
              <ul className="ps-8 ml-12 mb-2">
                {ideaItem.ws.Who_Primary.length > 0 ? ideaItem.ws.Who_Primary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
              </ul>
              <p>Who Secondary:</p>
              <ul className="ps-8 ml-12 mb-2">
                {ideaItem.ws.Who_Secondary.length > 0 ? ideaItem.ws.Who_Secondary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
              </ul>
              <p>What Primary:</p>
              <ul className="ps-8 ml-12 mb-2">
                {ideaItem.ws.What_Primary.length > 0 ? ideaItem.ws.What_Primary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
              </ul>
              <p>What Secondary:</p>
              <ul className="ps-8 ml-12 mb-2">
                {ideaItem.ws.What_Secondary.length > 0 ? ideaItem.ws.What_Secondary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
              </ul>
              <p>Where Primary:</p>
              <ul className="ps-8 ml-12 mb-2">
                {ideaItem.ws.Where_Primary.length > 0 ? ideaItem.ws.Where_Primary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
              </ul>
              <p>Where Secondary:</p>
              <ul className="ps-8 ml-12 mb-2">
                {ideaItem.ws.Where_Secondary.length > 0 ? ideaItem.ws.Where_Secondary.map((item, idx) => (
                  <li className="list-disc" key={idx}>{item}</li>
                )) : <div>No Items</div>}
              </ul>
            </div>
          </div>
        </>
        )) : <div>No Actions! Save Situations in Previous Page to find Actions</div>
      }
    </div>
  );
};

export default JsonBody;
