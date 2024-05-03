import { Steps } from "antd";

const Stepper = ({ currentStep }) => (
    <Steps
        current={currentStep}
        items={[
            {
                title: "Story Upload",
            },
            {
                title: "3 W's Selection",
            },
            {
                title: "Title Selection",
            },
            {
                title: "Ideas Selection",
            },
            {
                title: "Situation Selection",
            },
        ]}
    />
);
export default Stepper;