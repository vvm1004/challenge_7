import { Badge, Descriptions, Divider, Drawer } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getUserByIdAPI, getBookByIdAPI } from "@/services/api";

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IOrderWithUser | null;
  setDataViewDetail: (v: IOrderWithUser | null) => void;
}

const DetailOrder = ({
  openViewDetail,
  setOpenViewDetail,
  dataViewDetail,
  setDataViewDetail,
}: IProps) => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bookList, setBookList] = useState<any[]>([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!dataViewDetail) return;

      try {
        const userRes = await getUserByIdAPI(dataViewDetail.userId);
        setUserInfo(userRes.data);

        const bookPromises = dataViewDetail.productIds.map((bookId) =>
          getBookByIdAPI(bookId)
        );
        const bookResults = await Promise.all(bookPromises);
        setBookList(bookResults.map((res) => res.data));
      } catch (err) {
        console.error("Error fetching order details", err);
      }
    };

    fetchDetails();
  }, [dataViewDetail]);

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
    setUserInfo(null);
    setBookList([]);
  };

  return (
    <Drawer
      title={`Order #${dataViewDetail?.id}`}
      width={isMobile ? "100vw" : "60vw"}
      open={openViewDetail}
      onClose={onClose}
      bodyStyle={{ padding: 16 }}
    >
      <Descriptions title="User Information" bordered column={isMobile ? 1 : 2}>
        <Descriptions.Item label="Full Name">{userInfo?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{userInfo?.email}</Descriptions.Item>
        <Descriptions.Item label="Phone">{userInfo?.phone}</Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Books Ordered</Divider>
      <Descriptions bordered column={1}>
        {bookList.map((book, idx) => (
          <Descriptions.Item key={book.id} label={`Book ${idx + 1}`}>
            <div><b>Name:</b> {book.name}</div>
            <div><b>Author:</b> {book.author}</div>
            <div>
              <b>Price:</b>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(book.price)}
            </div>
            <div><b>Category:</b> {book.category}</div>
          </Descriptions.Item>
        ))}
      </Descriptions>

      <Divider orientation="left">Order Info</Divider>
      <Descriptions bordered column={isMobile ? 1 : 2}>
        <Descriptions.Item label="Amount">{dataViewDetail?.amount}</Descriptions.Item>
        <Descriptions.Item label="Total Price">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(dataViewDetail?.totalPrice || 0)}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Badge status="processing" text={dataViewDetail?.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Created At">
          {dayjs(dataViewDetail?.createdAt).format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {dayjs(dataViewDetail?.updatedAt).format("YYYY-MM-DD HH:mm")}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default DetailOrder;
