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
import { getCategoryAPI } from "@/services/api";
import { updateProduct, resetUpdate } from "@/redux/product/productSlice";
import { broadcastProductChange } from "@/utils/broadcast";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IProductTable | null;
  setDataUpdate: (v: IProductTable | null) => void;
}

type FieldType = {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  thumbnail: string;
  description?: string;
};

const UpdateProduct = ({
  openModalUpdate,
  setOpenModalUpdate,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: IProps) => {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const [isSubmit, setIsSubmit] = useState(false);
  const [listCategory, setListCategory] = useState<{ label: string; value: string }[]>([]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const { isUpdateSuccess, error } = useAppSelector((state) => state.product);

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
        name: dataUpdate.name.trim(),
        price: dataUpdate.price,
        stock: dataUpdate.stock,
        category: dataUpdate.category?.trim() || "",
        description: dataUpdate.description?.trim() || "",
      });

    }
  }, [dataUpdate]);

  useEffect(() => {
    if (isUpdateSuccess) {
      message.success("Product updated successfully");
      dispatch(resetUpdate());
      form.resetFields();
      setDataUpdate(null);
      setOpenModalUpdate(false);
      refreshTable();
       broadcastProductChange(); 
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Update failed",
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
      updatedAt: new Date().toISOString(),
    };

    await dispatch(updateProduct({ id: values.id, data: payload }));
    setIsSubmit(false);
  };


  return (
    <Modal
      title="Update Product"
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
      width={isMobile ? "100vw" : "50vw"}
    >
      <Divider />
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
        <Row gutter={[16, 16]}>
          <Form.Item<FieldType> name="id" hidden>
            <Input />
          </Form.Item>

          <Col xs={24} md={12}>
            <Form.Item<FieldType>
              label="Product Name"
              name="name"
              rules={[{ required: true, message: "Please enter product name!" }]}
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
                addonAfter="đ"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item<FieldType>
              label="Stock"
              name="stock"
              rules={[{ required: true, message: "Please enter stock!" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item<FieldType>
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select category!" }]}
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

export default UpdateProduct;
