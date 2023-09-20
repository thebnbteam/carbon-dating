import { FingerPrintLogo } from "../../components";
import { bioQuestions } from "../../bioquestionconstant";
import { Link } from "react-router-dom";
import { Form, Input } from "antd";
import { SubmitButton } from "../../components";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection } from "../../firebase/firebase-config";

export const CalibrationQuestionsPage = () => {
  const [form] = Form.useForm();
  const { currentUser } = useUserAuth();

  const bioSubmit = async () => {
    const filledInfo = form.getFieldsValue();
    try {
      const userDocRef = doc(dataCollection, currentUser.uid);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const existingData = docSnapshot.data();
        const updatedData = {
          ...existingData,
          userInfo: filledInfo,
        };

        await updateDoc(userDocRef, { userInfo: updatedData.userInfo });

        console.log("UserInfo updated successfully");
      } else {
        await setDoc(userDocRef, { userInfo: filledInfo });
        console.log("Data added successfully");
      }
    } catch (err) {
      console.error(err.message);
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
