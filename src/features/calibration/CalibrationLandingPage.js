import { FingerPrintLogo } from "../../components";
import { Link } from "react-router-dom";
import { DownSquareOutlined } from "@ant-design/icons";

export const CalibrationLandingPage = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <FingerPrintLogo />
        <h3 className="self-center text-center text-4xl mx-10 mb-20">
          Let's find out more about YOU
        </h3>
        <Link to="/calibrationquestions">
          <DownSquareOutlined className="text-5xl" />
        </Link>
      </div>
    </>
  );
};
