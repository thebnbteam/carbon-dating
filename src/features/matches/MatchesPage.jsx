import { useState, useEffect } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection, db } from "../../firebase/firebase-config";
import {
  doc,
  getDoc,
  collection,
  writeBatch,
  onSnapshot,
} from "firebase/firestore";
import { Button, Card, Modal, Carousel, Image, Layout } from "antd";
import { useNavigate } from "react-router";
import { StarTwoTone } from "@ant-design/icons";
import { Spinner } from "../../components";

const { Meta } = Card;

const { Content } = Layout;

export const MatchesPage = () => {
  const { userUid, matchedUsers, setMatchedUsers, isLoading, setIsLoading } =
    useUserAuth();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const getMatches = async () => {
    try {
      const userDocRef = doc(dataCollection, userUid);
      const chatRoomsCollectionRef = collection(userDocRef, "chatRooms");

      const chatRoomWatcher = onSnapshot(chatRoomsCollectionRef, (snapshot) => {
        const profiles = [];
        const updateBatch = writeBatch(db);
        snapshot.forEach((room) => {
          const roomObj = room.data();
          const matchedUser = roomObj.matchedUserUid;
          const matchedProfile = getMatchedUserProfile(matchedUser);
          matchedProfile.then((response) => {
            roomObj.matchedUserProfile = response;
            profiles.push(roomObj);
          });
          updateBatch.update(room.ref, { checked: true });
        });
        setIsLoading(false);
        setTimeout(() => {
          updateBatch.commit().then(() => {
            setMatchedUsers(profiles);
          });
        }, 1000);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getMatchedUserProfile = async (matchedUid) => {
    const matchedProfile = await getDoc(doc(dataCollection, matchedUid));
    const response = matchedProfile.data();
    return response;
  };

  useEffect(() => {
    getMatches();
  }, [userUid]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <h1 className="text-center mt-5 mb-auto font-bold">Matches</h1>
      {!isLoading && (
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
            {matchedUsers.length > 0 ? (
              matchedUsers.map((match) => {
                const {
                  matchedUserProfile,
                  rank,
                  matchedUserUid,
                  checked,
                  room,
                } = match;

                return (
                  <Card
                    hoverable
                    style={{
                      width: 240,
                    }}
                    cover={<img src={matchedUserProfile.profilePicture.url} />}
                  >
                    <div className="flex flex-col gap-1">
                      <Meta
                        avatar={
                          !checked && <StarTwoTone twoToneColor="#eb2f96" />
                        }
                        title={matchedUserProfile.userInfo.name}
                      />
                      <h3>Tier: {rank}</h3>
                      <Button
                        onClick={() => {
                          navigate(`/chatroom/${room}/${matchedUserUid}`);
                        }}
                      >
                        Message
                      </Button>
                      <Button
                        onClick={() => {
                          setOpenModal(true);
                          setSelectedUser(match.matchedUserProfile);
                        }}
                      >
                        Profile
                      </Button>
                      {openModal && selectedUser && (
                        <Modal
                          title={selectedUser.userInfo.name}
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
              <Spinner />
            )}
          </Content>
        </Layout>
      )}
    </>
  );
};
