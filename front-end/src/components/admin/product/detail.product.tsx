import { Badge, Descriptions, Drawer } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IProductTable | null;
  setDataViewDetail: (v: IProductTable | null) => void;
}

const DetailProduct = ({
  openViewDetail,
  setOpenViewDetail,
  dataViewDetail,
  setDataViewDetail,
}: IProps) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  return (
    <Drawer
      title="Product Details"
      width={isMobile ? "100vw" : "60vw"}
      open={openViewDetail}
      onClose={onClose}
      bodyStyle={{ padding: 16 }}
    >
      <Descriptions
        title="Product Information"
        bordered
        column={isMobile ? 1 : 2}
      >
        <Descriptions.Item label="ID">{dataViewDetail?.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{dataViewDetail?.name}</Descriptions.Item>
        <Descriptions.Item label="Price">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(dataViewDetail?.price ?? 0)}
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          <Badge status="processing" text={dataViewDetail?.category} />
        </Descriptions.Item>
        <Descriptions.Item label="Stock">{dataViewDetail?.stock}</Descriptions.Item>
        <Descriptions.Item label="Created At">
          {dayjs(dataViewDetail?.createdAt).format("MM-DD-YYYY HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {dayjs(dataViewDetail?.updatedAt).format("MM-DD-YYYY HH:mm")}
        </Descriptions.Item>
        {dataViewDetail?.description && (
          <Descriptions.Item label="Description" span={2}>
            {dataViewDetail.description}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Drawer>
  );
};

export default DetailProduct;
