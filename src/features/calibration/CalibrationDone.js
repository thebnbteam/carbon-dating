import { useNavigate } from "react-router-dom";
import { Button } from "antd";

export const CalibrationDone = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <h2 className="text-center">All done!</h2>
        <h2 className="text-center">Let go upload some pictures!</h2>
        <Button size="large" onClick={() => navigate("/profilepage")}>
          Profile Page
        </Button>
      </div>
    </>
  );
};

export default CalibrationDone;
