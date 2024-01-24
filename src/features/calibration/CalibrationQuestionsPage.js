import { FingerPrintLogo } from "../../components";
import { bioQuestions } from "../../bioquestionconstant";
import { Link } from "react-router-dom";
import { Form, Input, message } from "antd";
import { SubmitButton } from "../../components";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection } from "../../firebase/firebase-config";

export const CalibrationQuestionsPage = () => {
  const [form] = Form.useForm();
  const { userUid, setUserInfo } = useUserAuth();

  const bioSubmit = async () => {
    const filledInfo = form.getFieldsValue();
    try {
      const userDocRef = doc(dataCollection, userUid);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        await updateDoc(userDocRef, { userInfo: filledInfo });
        setUserInfo(filledInfo);
        message.success("Information has been updated", 2);
      }
    } catch (err) {
      message.error(err, 2);
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
