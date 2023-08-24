import { FingerPrintLogo } from "../../components";
import { bioQuestions } from "../../bioquestionconstant";
import { Link } from "react-router-dom";
import { Form, Input } from "antd";
import { SubmitButton } from "../../components";
import { setDoc, doc } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";

export const CalibrationQuestionsPage = () => {
  const [form] = Form.useForm();
  const { userData } = useUserAuth();

  const bioSubmit = async () => {
    try {
      await setDoc(doc(userData, "userInfo"), form.getFieldsValue(), {
        merge: true,
      });
      console.log("Data added successfully");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <FingerPrintLogo />
      <Form form={form}>
        {bioQuestions.map((category) => (
          <Form.Item
            className="flex flex-col"
            name={category}
            label={capitalizeFirstLetter(category)}
            rules={[
              {
                required: true,
                message: `Please put your ${category}!`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        ))}
        <Link to="/calibrationintro">
          <span className="flex justify-center">
            <SubmitButton form={form} onSubmit={bioSubmit} />
          </span>
        </Link>
      </Form>
    </div>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
