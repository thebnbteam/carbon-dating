import React, { useState, useEffect } from "react";
import { ProfilePictureBox } from "../../components";
import { Button, Alert, message, Upload, Form, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUserAuth } from "../../context/UserAuthContext";
import { useNavigate } from "react-router";
import { storage } from "../../firebase/firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Timestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { dataCollection } from "../../firebase/firebase-config";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const ProfilePage = () => {
  const { userUid, setUploadedPictures, categoryLikes } = useUserAuth();
  const navigate = useNavigate();

  const [fileList, setFileList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);
  const [previewTitle, setPreviewTitle] = useState(false);

  const handleCancel = () => setPreviewVisible(false);

  const beforeUpload = (file) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      message.error(`${file.name} is not a valid image type`, 2);
      return null;
    }
    return false;
  };

  const handleChange = ({ fileList }) =>
    setFileList(fileList.filter((file) => file.status !== "error"));

  const onRemove = async (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);

    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleFinish = async () => {
    try {
      await Promise.all(
        fileList.map(async (file) => {
          const fileName = `pictures-${userUid}-${file.name}`;
          const fileStorageRef = ref(storage, fileName);
          try {
            await uploadBytes(fileStorageRef, file.originFileObj);
            const downloadUrl = await getDownloadURL(fileStorageRef);
            const pictures = {
              url: downloadUrl,
              path: fileName,
              uploadedAt: Timestamp.now(),
            };
            const docRef = doc(dataCollection, userUid);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.data().pictures) {
              const existingPictures = docSnapshot.data().pictures || [];
              const pictureExists = existingPictures.filter(
                (existingPicture) => {
                  return existingPicture.path === pictures.path;
                }
              );
              if (pictureExists.length > 0) {
                message.error(`This picture exists!`, 2);
                setFileList([]);
              } else if (pictureExists.length == 0) {
                await updateDoc(docRef, {
                  pictures: arrayUnion(pictures),
                });
                setFileList([]);
              }
            } else {
              await updateDoc(docRef, { pictures: [pictures] });
              setFileList([]);
            }
          } catch (error) {
            console.log(error);
          }
        })
      );
      message.success(`Images added successfully.`, 2);
    } catch (error) {
      console.log(error);
      message.error(`Error adding images`, 2);
    }
  };

  useEffect(() => {
    if (userUid) {
      const documentRef = doc(dataCollection, userUid);
      const unsubscribe = onSnapshot(documentRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data().pictures;
          setUploadedPictures(data);
        } else {
          console.log("Document does not exist");
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [userUid]);

  return (
    <>
      <div className="flex flex-col mx-4 gap-6">
        <h2 className="text-center">profile</h2>
        <ProfilePictureBox />
        <div className="mt-10 flex flex-col gap-3">
          <Button size="large" onClick={() => navigate("/recalibrationpage")}>
            Recalibrate
          </Button>
          <Button
            size="large"
            onClick={() => navigate("/calibrationquestions")}
          >
            Edit Personal Info
          </Button>
          <Form onFinish={handleFinish}>
            <Upload
              className="flex flex-col justify-center"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onPreview={handlePreview}
              onChange={handleChange}
              onRemove={onRemove}
              multiple={true}
              maxCount={5}
            >
              <Button block size="large" icon={<UploadOutlined />}>
                Upload Pictures
              </Button>
            </Upload>
            <Button htmlType="submit" className="my-[10px]" size="large" block>
              Upload
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
};
