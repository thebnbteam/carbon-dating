import { useState, useEffect } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection } from "../../firebase/firebase-config";
import {
  doc,
  getDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { Button, Card, Modal, Carousel, Image, Layout } from "antd";
import { useNavigate } from "react-router";
import { StarTwoTone } from "@ant-design/icons";

const { Meta } = Card;

const { Content } = Layout;

export const MatchesPage = () => {
  const {
    userUid,
    matchedUpdates,
    setMatchedUpdates,
    matchedUsers,
    setMatchedUsers,
  } = useUserAuth();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getMatches = async () => {
    try {
      const userDocRef = doc(dataCollection, userUid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        if (matchedUpdates) {
          const matchedUid = matchedUpdates
            .filter((field) => field.hasOwnProperty("uid"))
            .map((field) => field.uid);
          const uidQuery = query(
            dataCollection,
            where("userLogin.uid", "in", matchedUid)
          );
          const liveGetMatchedUsers = onSnapshot(uidQuery, (snapshot) => {
            const profiles = [];
            snapshot.forEach((doc) => {
              profiles.push(doc.data());
            });
            setMatchedUsers(profiles);
          });
          updateMatchCheck();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateMatchCheck = async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        setMatchedUpdates((prevMatchInfo) =>
          prevMatchInfo.map((match) => ({ ...match, checked: true }))
        );
        resolve();
      }, 2000);
    });
    const userDocRef = doc(dataCollection, userUid);
    await updateDoc(userDocRef, {
      matched: matchedUpdates,
    });
  };

  useEffect(() => {
    getMatches();
  }, [userUid]);

  return (
    <>
      <h1 className="text-center mt-5 mb-auto font-bold">Matches</h1>

      <Layout
        style={{
          overflowY: "auto",
          height: "100%",
          background: "white",
        }}
      >
        <Content
          style={{
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {matchedUpdates ? (
            matchedUpdates.map((match) => {
              let user = {};
              matchedUsers.forEach((profile) => {
                if (profile.userLogin.uid == match.uid) {
                  user.name = profile.userInfo.name;
                  user.pictureUrl = profile.profilePicture.url;
                  user.userInfo = profile.userInfo;
                  user.pictures = profile.pictures;
                }
              });
              return (
                <Card
                  hoverable
                  style={{
                    width: 240,
                  }}
                  cover={<img src={user.pictureUrl} />}
                >
                  <div className="flex flex-col gap-1">
                    <Meta
                      avatar={
                        !match.checked && <StarTwoTone twoToneColor="#eb2f96" />
                      }
                      title={user.name}
                    />
                    <h3>Tier: {match.rank}</h3>
                    <Button
                      onClick={() => {
                        navigate(`/chatroom/${match.room}/${match.uid}`);
                      }}
                    >
                      Message
                    </Button>
                    <Button
                      onClick={() => {
                        setOpenModal(true);
                        setSelectedUser(user);
                      }}
                    >
                      Profile
                    </Button>
                    {openModal && selectedUser && (
                      <Modal
                        title={selectedUser.name}
                        open={openModal}
                        closable={true}
                        footer={null}
                        destroyOnClose={true}
                        onCancel={() => {
                          setOpenModal(false);
                          setSelectedUser(null);
                        }}
                      >
                        <Carousel dotPosition="top" autoplay>
                          {selectedUser?.pictures.map((pic) => (
                            <div className="flex justify-center">
                              <Image
                                height={200}
                                width={200}
                                src={pic.url}
                                path={pic.path}
                              />
                            </div>
                          ))}
                        </Carousel>
                        <div className="m-5">
                          {Object.keys(selectedUser.userInfo).map((info) => (
                            <p className="text-center">
                              {info}: {selectedUser.userInfo[info]}
                            </p>
                          ))}
                        </div>
                      </Modal>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <h1>No Matches Yet!</h1>
          )}
        </Content>
      </Layout>
    </>
  );
};
