import { useState, useEffect } from "react";
import { useUserAuth } from "../../context/UserAuthContext";
import { dataCollection } from "../../firebase/firebase-config";
import { doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { Button, Card, Modal, Carousel, Image } from "antd";
import { useNavigate } from "react-router";

const { Meta } = Card;

export const MatchesPage = () => {
  const { userUid } = useUserAuth();
  const navigate = useNavigate();
  const [matchInfo, setMatchInfo] = useState([]);
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const userDocRef = doc(dataCollection, userUid);

  const getMatches = async () => {
    try {
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userMatches = userDocSnapshot.data().matched;
        setMatchInfo(userMatches);
        const matchUserArray = userMatches
          .filter((field) => field.hasOwnProperty("uid"))
          .map((field) => field.uid);
        const filtered = query(
          dataCollection,
          where("userLogin.uid", "in", matchUserArray)
        );
        const filteredMatch = await getDocs(filtered);
        let matchArray = [];
        filteredMatch.forEach((doc) => {
          matchArray.push(doc.data());
        });
        setMatchedUsers(matchArray);
      }
    } catch (error) {
      console.error(error, "Error");
    }
  };
  useEffect(() => {
    getMatches();
  }, [userUid]);

  return (
    <>
      <h1 className="text-center mt-5 mb-auto font-bold">Matches</h1>
      <div className="flex flex-col items-center mt-0 mb-auto gap-1">
        {matchInfo
          ? matchInfo.map((match) => {
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
                    <Meta title={user.name} />
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
          : null}
      </div>
    </>
  );
};
