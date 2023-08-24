import { FingerPrintLogo, LandingButtons } from "../../components";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export const CalibrationDone = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-center m-6">all done! let's go find your match!</h2>
        <Button size="large" onClick={() => navigate("/swipelandingpage")}>
          let's go!
        </Button>
        <Button size="large" onClick={() => navigate("/recalibrationpage")}>
          i made a mistake!
        </Button>
        <Button size="large" onClick={() => navigate("/calibrationcategories")}>
          restart from beginning!
        </Button>
      </div>
    </>
  );
};

export default CalibrationDone;
