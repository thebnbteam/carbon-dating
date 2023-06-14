import { FingerPrintLogo, LandingButtons } from "../components";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  return (
    <div className="flex flex-col items-center gap-4 my-[20%]">
      <h2 className="text-center">carbon</h2>
      <h2 className="text-center">dating</h2>
      <FingerPrintLogo />
      <Link to="/loginpage">
        <div className="flex flex-col items-center gap-4">
          <LandingButtons text="l o g i n" />
          <LandingButtons text="create account" />
        </div>
      </Link>
    </div>
  );
};
