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
import { createBookAPI, getCategoryAPI } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  author: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  description?: string;
};

const CreateBook = ({ openModalCreate, setOpenModalCreate, refreshTable }: IProps) => {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState<{ label: string; value: string }[]>([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

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

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    const payload = {
      ...values,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await createBookAPI(payload);

    if (res && res.success) {
      message.success("Book created successfully");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      notification.error({
        message: "An error occurred",
        description: res.message,
      });
    }

    setIsSubmit(false);
  };

  return (
    <Modal
      title="Add New Book"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setOpenModalCreate(false);
      }}
      okButtonProps={{ loading: isSubmit }}
      okText="Create"
      cancelText="Cancel"
      maskClosable={false}
      destroyOnClose
      width={isMobile ? "100vw" : "50vw"}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Book Title"
              name="name"
              rules={[{ required: true, message: "Please enter book title!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Author"
              name="author"
              rules={[{ required: true, message: "Please enter author name!" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item<FieldType>
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price!" }]}
            >
              <InputNumber
                min={1000}
                style={{ width: "100%" }}
                formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                addonAfter="VND"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item<FieldType>
              label="Stock Quantity"
              name="stock"
              rules={[{ required: true, message: "Please enter stock quantity!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item<FieldType>
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select showSearch options={listCategory} allowClear />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item<FieldType>
              label="Thumbnail Image URL"
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


export default CreateBook;
