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
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createNewProduct, resetCreate } from "@/redux/product/productSlice";
import { getCategoryAPI } from "@/services/api";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (v: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  description?: string;
};

const CreateProduct = ({ openModalCreate, setOpenModalCreate, refreshTable }: IProps) => {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState<
    { label: string; value: string }[]
  >([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { isCreateSuccess, error } = useAppSelector((state) => state.product);

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
    if (isCreateSuccess) {
      message.success("Product created successfully");
      dispatch(resetCreate());
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    }
  }, [isCreateSuccess]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "An error occurred",
        description: error,
      });
    }
  }, [error]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    const payload = {
      ...values,
      name: values.name.trim(),
      thumbnail: values.thumbnail?.trim() || "",
      description: values.description?.trim() || "",
      category: values.category?.trim() || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await dispatch(createNewProduct(payload));
    setIsSubmit(false);
  };


  return (
    <Modal
      title="Add New Product"
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

        
          <Col xs={24} md={8}>
            <Form.Item<FieldType>
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please enter price!" }]}
            >
              <InputNumber
                min={1000}
                style={{ width: "100%" }}
                formatter={(val) =>
                  `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
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
            <Form.Item<FieldType> label="Description (optional)" name="description">
              <Input.TextArea autoSize={{ minRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateProduct;
