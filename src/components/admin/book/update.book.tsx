import { useEffect, useState } from "react";
import {
  App,
  Col,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
} from "antd";
import type { FormProps } from "antd";
import { getCategoryAPI, updateBookAPI } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IBookTable | null;
  setDataUpdate: (v: IBookTable | null) => void;
}

type FieldType = {
  id: number;
  name: string;
  author: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  description?: string;
};

const UpdateBook = ({
  openModalUpdate,
  setOpenModalUpdate,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: IProps) => {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryAPI();
      if (res && res.data) {
        const options = res.data.map((item: { id: number; name: string }) => ({
          label: item.name,
          value: item.name,
        }));
        setListCategory(options);
      }
    };
    fetchCategory();
  }, []);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        name: dataUpdate.name,
        author: dataUpdate.author,
        price: dataUpdate.price,
        stock: dataUpdate.stock,
        category: dataUpdate.category,
        thumbnail: dataUpdate.thumbnail,
        description: dataUpdate.description,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    const payload = {
      ...values,
      updatedAt: new Date().toISOString(),
    };

    const res = await updateBookAPI(values.id, payload);

    if (res && res.success) {
      message.success("Book updated successfully");
      form.resetFields();
      setDataUpdate(null);
      setOpenModalUpdate(false);
      refreshTable();
    } else {
      notification.error({
        message: "Update failed",
        description: res.message,
      });
    }

    setIsSubmit(false);
  };

  return (
    <Modal
      title="Update Book"
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setDataUpdate(null);
        setOpenModalUpdate(false);
      }}
      okButtonProps={{ loading: isSubmit }}
      okText="Update"
      cancelText="Cancel"
      maskClosable={false}
      destroyOnClose
      width="50vw"
    >
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Form.Item<FieldType> name="id" hidden>
            <Input />
          </Form.Item>

          <Col span={12}>
            <Form.Item<FieldType>
              label="Book Name"
              name="name"
              rules={[{ required: true, message: "Please enter book name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item<FieldType>
              label="Author"
              name="author"
              rules={[{ required: true, message: "Please enter author name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item<FieldType>
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price!" }]}
            >
              <InputNumber
                min={1000}
                style={{ width: "100%" }}
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                addonAfter="đ"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item<FieldType>
              label="Stock"
              name="stock"
              rules={[{ required: true, message: "Please enter stock!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item<FieldType>
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select showSearch options={listCategory} allowClear />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="Thumbnail URL"
              name="thumbnail"
              rules={[{ required: true, message: "Please enter thumbnail URL!" }]}
            >
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType> label="Description (optional)" name="description">
              <Input.TextArea autoSize={{ minRows: 3 }} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Thumbnail Preview">
              <Form.Item shouldUpdate noStyle>
                {() => {
                  const thumbnail = form.getFieldValue("thumbnail");
                  return (
                    thumbnail && (
                      <Image
                        src={thumbnail}
                        width={150}
                        height={220}
                        style={{ objectFit: "cover", borderRadius: 4 }}
                        alt="thumbnail-preview"
                        fallback="https://via.placeholder.com/150"
                      />
                    )
                  );
                }}
              </Form.Item>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default UpdateBook;
