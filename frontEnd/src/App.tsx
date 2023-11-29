import HeaderComponent from "./layout/header/HeaderComponent";
import Sidebar from "./layout/sidebar/Sidebar";
import { Layout } from "antd";
import "./app.scss";
import { Content } from "antd/es/layout/layout";
import { Outlet } from "react-router-dom";

const styles: React.CSSProperties = {
  backgroundColor: "transparent",
  width: "100%",
  margin: "10px",
  // backgroundImage:
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  height: "98vh",
  width: "99%",
  padding: "0px",
  margin: "auto",
};

function App() {
  return (
    <div style={containerStyle} className="container">
      <HeaderComponent />
      <Layout hasSider style={styles}>
        <Sidebar />
        <Content style={styles}>
          <Outlet />
        </Content>
      </Layout>
      {/* <ItemWPListComponent /> */}
    </div>
  );
}

export default App;
