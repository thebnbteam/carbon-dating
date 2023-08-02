import { useState, useEffect } from "react";
import { FingerPrintLogo } from "../../components";
import { bioQuestions } from "../../bioquestionconstant";
import { Link } from "react-router-dom";
import { Form, Input } from "antd";
import { SubmitButton } from "../../components";
import { db } from "../../firebase/firebase-config";
import { addDoc, collection, getDocs } from "firebase/firestore";

export const CalibrationQuestionsPage = () => {
  const [form] = Form.useForm();
  const [bioData, setBioData] = useState({});
  const bioColletionRef = collection(db, "userInfo");

  const getBioData = async () => {
    try {
      const data = await getDocs(bioColletionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setBioData(filteredData);
    } catch (err) {
      console.error(err);
    }
  };
  const bioSubmit = async () => {
    try {
      await addDoc(bioColletionRef, form.getFieldsValue());
      getBioData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getBioData();
    if (bioData) {
      console.log(bioData);
    }
  }, []);

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
