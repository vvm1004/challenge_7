import { Badge, Descriptions, Divider, Drawer, Image, Upload } from "antd";
import { useEffect, useState } from "react";
import type { UploadFile, UploadProps, GetProp } from "antd";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface IProps {
  openViewDetail: boolean;
  setOpenViewDetail: (v: boolean) => void;
  dataViewDetail: IBookTable | null;
  setDataViewDetail: (v: IBookTable | null) => void;
}

const DetailBook = ({
  openViewDetail,
  setOpenViewDetail,
  dataViewDetail,
  setDataViewDetail,
}: IProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (dataViewDetail?.thumbnail) {
      const file: UploadFile = {
        uid: uuidv4(),
        name: "thumbnail",
        status: "done",
        url: dataViewDetail.thumbnail,
      };
      setFileList([file]);
    } else {
      setFileList([]);
    }
  }, [dataViewDetail]);

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
    setFileList([]);
  };

  return (
    <Drawer
      title="Book Details"
      width={"60vw"}
      open={openViewDetail}
      onClose={onClose}
    >
      <Descriptions title="Book Information" bordered column={2}>
        <Descriptions.Item label="ID">{dataViewDetail?.id}</Descriptions.Item>
        <Descriptions.Item label="Name">{dataViewDetail?.name}</Descriptions.Item>
        <Descriptions.Item label="Author">{dataViewDetail?.author}</Descriptions.Item>
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

      <Divider orientation="left">Book Thumbnail</Divider>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        showUploadList={{ showRemoveIcon: false }}
      />
      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Drawer>
  );
};

export default DetailBook;
