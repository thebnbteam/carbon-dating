import React, { forwardRef } from "react";
import { Card, Image } from "antd";
import TinderCard from "react-tinder-card";

const { Meta } = Card;

const MatchesDisplayBox = forwardRef(
  ({ data, expanded, swiped, ref }, index) => {
    return (
      <>
        <TinderCard
          onSwipe={(dir) => swiped(dir, data.userInfo.name, index)}
          ref={ref}
          className="absolute"
          key={data.userInfo.name}
        >
          <Card
            on
            hoverable
            style={{
              width: 250,
              margin: 10,
            }}
            cover={
              <Image
                height={250}
                width={250}
                src={data.profilePicture.url}
                alt="cute cat picture"
              />
            }
          >
            <Meta title={data.userInfo.name} />
            {/* Map function with top 5 and categories they like */}
            {expanded && (
              <Card
                style={{
                  marginTop: 15,
                }}
                type="inner"
                title="Loves (Top 5)"
              >
                <div className="flex flex-wrap justify-center">
                  {data.topFive.map((topic) => {
                    return <p className="mx-1">{topic}</p>;
                  })}
                </div>
              </Card>
            )}
          </Card>
        </TinderCard>
      </>
    );
  }
);

export default MatchesDisplayBox;
