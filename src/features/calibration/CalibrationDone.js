import { FingerPrintLogo, LandingButtons } from "../../components";
import { Link } from "react-router-dom";

export const CalibrationDone = () => {
  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-center m-6">all done! let's go find your match!</h2>
        <LandingButtons text={"let's go!"} />
        <LandingButtons text={"i made a mistake!"} />
      </div>
    </>
  );
};

export default CalibrationDone;
