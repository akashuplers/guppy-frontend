import { Button, Popconfirm } from "antd";
import { useState } from "react";

const FooterButtons = ({ onDiscard = () => {}, onReset = () => {}, onSubmit = () => {}, isSubmitting }) => {
  const [showDiscardPopConfirm, setShowDiscardPopConfirm] = useState(false);
  const [showResetPopConfirm, setShowResetPopConfirm] = useState(false);

  return (
    <div className="mt-8 flex justify-between">
      <Popconfirm
        title="Discard"
        description="Are you sure you want to discard all changes?"
        open={showDiscardPopConfirm}
        onOpenChange={() => setShowDiscardPopConfirm(!showDiscardPopConfirm)}
        onConfirm={onDiscard}
        onCancel={() => setShowDiscardPopConfirm(false)}
        okButtonProps={{ className: 'bg-blue-500 border-blue-600 text-white' }}
        cancelButtonProps={{ className: 'bg-gray-100' }}
        okText="Yes"
        cancelText="No"
      >
        <Button
          className="bg-red-50"
          danger
        >
          Discard
        </Button>
      </Popconfirm>
      <div>
        <Popconfirm
          title="Reset"
          description="Are you sure you want to reset all changes?"
          open={showResetPopConfirm}
          onOpenChange={() => setShowResetPopConfirm(!showResetPopConfirm)}
          onConfirm={onReset}
          onCancel={() => setShowResetPopConfirm(false)}
          okButtonProps={{ className: 'bg-blue-500 border-blue-600 text-white' }}
          cancelButtonProps={{ className: 'bg-gray-100' }}
          okText="Yes"
          cancelText="No"
        >
          <Button
            className="me-2 md:me-5 bg-gray-100 border-gray-500 text-gray-500"
            type="secondary"
          >
            Reset
          </Button>
        </Popconfirm>
        <Button
          onClick={onSubmit}
          type="primary"
          className="bg-blue-50 border-blue-500 text-blue-500"
          loading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default FooterButtons;
