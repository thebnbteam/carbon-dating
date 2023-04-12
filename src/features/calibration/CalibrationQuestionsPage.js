import { FingerPrintLogo } from "../../components";
import { bioQuestions } from "../../bioquestionconstant";
import { TextInput } from "../../components";
import { FaAngleDoubleDown } from "react-icons/fa";

export const CalibrationQuestionsPage = () => {
  return (
    <div className="flex flex-col items-center gap-10">
      <FingerPrintLogo />
      {bioQuestions.map((category) => (
        <TextInput title={category} />
      ))}
      <FaAngleDoubleDown className="text-5xl" />
    </div>
  );
};
