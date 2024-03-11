import { FingerPrintLogo } from "../components";
import { Link } from "react-router-dom";
import { Button } from "antd";

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-[20%]">
      <h2 className="text-center">carbon</h2>
      <h2 className="text-center">dating</h2>
      <FingerPrintLogo />

      <div className="flex flex-col items-center gap-4">
        <Link to="/loginpage">
          <Button type="default" size="large">
            l o g i n
          </Button>
        </Link>
        <Link to="/signuppage">
          <Button type="default" size="large">
            make account
          </Button>
        </Link>
      </div>
    </div>
  );
};
