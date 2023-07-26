import { Input, Button, Space, Layout } from "antd";
import { SendOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Header, Content, Footer } = Layout;

export const DMScreen = () => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Header
        style={{
          position: "sticky",
          top: 0,
          background: "white",
        }}
      >
        <h2 className="text-center">Match's Name</h2>
      </Header>
      <Content
        style={{
          background: "white",
        }}
      ></Content>
      <Footer
        style={{
          position: "sticky",
          bottom: 0,
          background: "white",
        }}
      >
        <Space.Compact
          style={{
            width: "100%",
          }}
        >
          <Input placeholder="Send them an ice breaker!" allowClear />
          <Button size="large" type="default" icon={<SendOutlined />} />
        </Space.Compact>
      </Footer>
    </Layout>
  );
};
