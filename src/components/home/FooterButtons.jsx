import { Button } from "antd";

const FooterButtons = ({ onDiscard = () => {}, onReset = () => {}, onSubmit = () => {} }) => {

  return (
    <div className="mt-8 flex justify-between">
      <Button
        onClick={onDiscard}
        className="bg-red-50"
        danger
      >
        Discard
      </Button>
      <div>
        <Button
          className="me-2 md:me-5 bg-gray-100 border-gray-500 text-gray-500"
          onClick={onReset}
        >
          Reset
        </Button>
        <Button
          onClick={onSubmit}
          type="primary"
          className="bg-blue-50 border-blue-500 text-blue-500"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default FooterButtons;
