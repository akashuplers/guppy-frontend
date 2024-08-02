
const JsonBody = ({ data }) => {
  return (
    <div>
      <p className="mb-2">
        Story World : {data.StoryWorld}
      </p>
      <p className="font-medium mb-1">MASTER Ws :</p>
      <div>
        <p>Who:</p>
        <p>Primary:</p>
        <ul className="ps-8">
          {data.master_ws.Who.primary.map((item, index) => (
            <li className="list-disc" key={index}>{item}</li>
          ))}
        </ul>
        <p>Secondary:</p>
        <ul className="ps-8">
          {data.master_ws.Who.secondary.map((item, index) => (
            <li className="list-disc" key={index}>{item}</li>
          ))}
        </ul>
        <p>What:</p>
        <p>Primary:</p>
        <ul className="ps-8">
          {data.master_ws.What.primary.map((item, index) => (
            <li className="list-disc" key={index}>{item}</li>
          ))}
        </ul>
        <p>Secondary:</p>
        <ul className="ps-8">
          {data.master_ws.What.secondary.map((item, index) => (
            <li className="list-disc" key={index}>{item}</li>
          ))}
        </ul>
        <p>Where:</p>
        <p>Primary:</p>
        <ul className="ps-8">
          {data.master_ws.Where.primary.map((item, index) => (
            <li className="list-disc" key={index}>{item}</li>
          ))}
        </ul>
        <p>Secondary:</p>
        <ul className="ps-8">
          {data.master_ws.Where.secondary.map((item, index) => (
            <li className="list-disc" key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="mt-6 mb-3 font-medium">TITLES :</p>
      {data.Title.map((titleItem, index) => (
        <div key={index} className="mb-2">
          {/* <p>{titleItem.title + " :"}</p> */}
          <p className="mb-1 font-medium">{`${index+1}. ${titleItem.title}`}</p>
          <div>
            <p>Who Primary:</p>
            <ul className="ps-8">
              {titleItem.ws.Who_Primary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              ))}
            </ul>
            <p>Who Secondary:</p>
            <ul className="ps-8">
              {titleItem.ws.Who_Secondary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              ))}
            </ul>
            <p>What Primary:</p>
            <ul className="ps-8">
              {titleItem.ws.What_Primary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              ))}
            </ul>
            <p>What Secondary:</p>
            <ul className="ps-8">
              {titleItem.ws.What_Secondary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              ))}
            </ul>
            <p>Where Primary:</p>
            <ul className="ps-8">
              {titleItem.ws.Where_Primary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              ))}
            </ul>
            <p>Where Secondary:</p>
            <ul className="ps-8">
              {titleItem.ws.Where_Secondary.map((item, idx) => (
                <li className="list-disc" key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JsonBody;
