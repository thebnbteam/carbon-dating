import { Card } from "antd";

const { Meta } = Card;

export const MatchesDisplayBox = ({ size, expanded }) => {
  return (
    <>
      <Card
        hoverable
        style={{
          width: size,
          margin: 10,
        }}
        cover={
          <img
            className="block object-cover rounded-lg"
            src="https://hips.hearstapps.com/hmg-prod/images/beautiful-smooth-haired-red-cat-lies-on-the-sofa-royalty-free-image-1678488026.jpg"
            alt="cute orange cat"
          />
        }
      >
        <Meta title="Match name" />
        {/* Map function with top 5 and categories they like */}
        {expanded && (
          <Card
            style={{
              marginTop: 15,
            }}
            type="inner"
            title="Top 5"
          >
            Loves: Movies, Food, Music
          </Card>
        )}
      </Card>
    </>
  );
};
