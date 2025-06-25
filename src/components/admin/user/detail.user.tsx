import { Avatar, Badge, Descriptions, Drawer, Grid } from "antd";
import dayjs from "dayjs";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IUserTable | null;
  setDataViewDetail: (v: IUserTable | null) => void;
}

const DetailUser = ({
  openViewDetail,
  setOpenViewDetail,
  dataViewDetail,
  setDataViewDetail,
}: IProps) => {
  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  return (
    <Drawer
      title="User Details"
      width={screens.xs ? "90vw" : "50vw"}
      onClose={onClose}
      open={openViewDetail}
      bodyStyle={{ paddingBottom: 24 }}
    >
      <Descriptions
        title="User Information"
        bordered
        column={screens.xs ? 1 : 2}
        size="middle"
      >
        <Descriptions.Item label="ID">
          {dataViewDetail?.id}
        </Descriptions.Item>

        <Descriptions.Item label="Full Name">
          {dataViewDetail?.name}
        </Descriptions.Item>

        <Descriptions.Item label="Email">
          {dataViewDetail?.email}
        </Descriptions.Item>

        <Descriptions.Item label="Phone">
          {dataViewDetail?.phone}
        </Descriptions.Item>

        <Descriptions.Item label="Role">
          <Badge
            status={dataViewDetail?.role === "admin" ? "processing" : "success"}
            text={dataViewDetail?.role?.toUpperCase()}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Avatar">
          <Avatar
            size={64}
            src={
              dataViewDetail?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                dataViewDetail?.name || "User"
              )}&background=random`
            }
            style={{ objectFit: "cover" }}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {dayjs(dataViewDetail?.createdAt).format("MM-DD-YYYY HH:mm")}
        </Descriptions.Item>

        <Descriptions.Item label="Updated At">
          {dayjs(dataViewDetail?.updatedAt).format("MM-DD-YYYY HH:mm")}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailUser;
