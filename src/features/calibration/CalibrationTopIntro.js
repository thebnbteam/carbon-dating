import { FingerPrintLogo } from "../../components";
import { Link } from "react-router-dom";
import { DownSquareOutlined } from "@ant-design/icons";

export const CalibrationTopIntro = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <FingerPrintLogo />
        <h2 className="text-center mx-10">now let's see your top 5!</h2>
        <Link to="/calibrationtopfive">
          <DownSquareOutlined className="text-5xl" />
        </Link>
      </div>
    </>
  );
};

export default CalibrationTopIntro;
