import { FingerPrintLogo } from "../../components";
import { FaAngleDoubleDown } from "react-icons/fa";

export const CalibrationLandingPage = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-10">
        <FingerPrintLogo />
        <h3 className="text-center text-4xl mx-10 mb-20">
          let's find out more about YOU
        </h3>
        <FaAngleDoubleDown className="text-5xl" />
      </div>
    </>
  );
};
