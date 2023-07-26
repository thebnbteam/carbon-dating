import React from "react";
import { Card } from "antd";

const { Meta } = Card;

export const ProfilePictureBox = () => {
  return (
    <Card
      hoverable
      style={{
        width: 300,
      }}
      cover={
        <img
          className="block object-cover rounded-lg"
          src="https://hips.hearstapps.com/hmg-prod/images/beautiful-smooth-haired-red-cat-lies-on-the-sofa-royalty-free-image-1678488026.jpg"
          alt="cute orange cat"
        />
      }
    >
      <Meta title="Username" description="User Info" />
    </Card>
  );
};
