// import { AudioOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Tag } from "antd";
import { SearchProps } from "antd/es/input";
import { useState } from "react";
import ListInfo from "./ListInfo";
import { TransportInfo } from "../../interface/TransportInterface";
import { handleGetTransportInfo } from "../../api/Handle/Transport";

const { Search } = Input;

function ToTransport() {
  const [listId, setListId] = useState<string[]>([]);
  const [id, setId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<TransportInfo[]>([]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSearch: SearchProps["onSearch"] = (value, _e, _info) => {
    console.log(value);
    setListId([...listId, value]);
    setId("");
  };

  const tagStyle: React.CSSProperties = {
    // width: "80%",
    fontSize: "medium",
    padding: "4px",
    margin: "2px 0px",
  };

  const handleClose = (idRemove: string) => {
    const newIds = listId.filter((id) => id !== idRemove);
    console.log(newIds);
    setListId(newIds);
  };
  const handleOnSubmit = async () => {
    console.log("submit");
    const res = await handleGetTransportInfo(listId);
    if (res?.success) {
      setData(res.data);
      showModal();
      setListId([]);
    }
  };
  return (
    <div style={{ margin: "auto", width: "500px" }}>
      <div
        style={{
          height: "300px",
          border: "1px solid black",
          margin: "10px 0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflow: "auto",
          borderRadius: "10px",
        }}
      >
        {listId.map((tag: string) => {
          const tagElem = (
            <Tag
              closable
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              onClose={(_e) => {
                handleClose(tag);
              }}
              color="cyan"
              style={tagStyle}
            >
              {tag}
            </Tag>
          );
          return (
            <span key={tag} style={{ display: "inline-block" }}>
              {tagElem}
            </span>
          );
        })}
      </div>
      <div>
        <Search
          value={id}
          placeholder="Nhap id cua don hang muon chuyen"
          onChange={(e) => {
            setId(e.currentTarget.value);
          }}
          enterButton="Add"
          size="large"
          allowClear
          onSearch={onSearch}
        />
      </div>

      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Button onClick={handleOnSubmit}>submit</Button>
      </div>
      <Modal
        title="Ket qua"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        // style={{ width: "700px" }}
        width={800}
      >
        <ListInfo data={data} />
      </Modal>
    </div>
  );
}

export default ToTransport;
