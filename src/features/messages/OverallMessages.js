import { Input, Space, Card, Row, Col } from "antd";

const { Search } = Input;

export const OverallMessages = () => {
  const lastMessage = "Hey thats hilarious!";

  return (
    <>
      <div>
        <h2 className="text-center">Messages</h2>
        <Search size="large" placeholder="Search matches" allowClear />
        <Card title="Activities" className="mt-10">
          {/* Map over the matches */}
          <Space size={[10]} wrap></Space>
        </Card>
        <Card title="Messages" className="mt-10">
          <Row align="middle">
            <Col flex="100px"></Col>
            <Col flex="auto">
              <Card
                title="Latest Message"
                style={{
                  width: "auto",
                }}
              >
                <p>Hey how is it going?</p>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};
