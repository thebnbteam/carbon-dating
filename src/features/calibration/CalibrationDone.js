import { FingerPrintLogo, LandingButtons } from "../../components";
import { Link } from "react-router-dom";
import { Button } from "antd";

export const CalibrationDone = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-center m-6">all done! let's go find your match!</h2>
        <Button size="large">let's go!</Button>
        <Button size="large">i made a mistake!</Button>
      </div>
    </>
  );
};

export default CalibrationDone;
