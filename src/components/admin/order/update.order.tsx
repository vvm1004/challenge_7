import { useEffect, useState } from "react";
import { App, Form, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateOrderAPI, getOrdersAPI } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  dataUpdate: IOrderWithUser | null;
  setDataUpdate: (v: IOrderWithUser | null) => void;
}

type FieldType = {
  id: number;
  status: OrderStatus;
};

const UpdateOrder = ({
  openModalUpdate,
  setOpenModalUpdate,
  refreshTable,
  dataUpdate,
  setDataUpdate,
}: IProps) => {
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        status: dataUpdate.status,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    setIsSubmit(true);

    const payload = {
      status: values.status,
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await updateOrderAPI(values.id, payload);
      if (res && res.success) {
        message.success("Order updated successfully");
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
    } catch (err) {
      notification.error({
        message: "Error",
        description: "Something went wrong",
      });
    }

    setIsSubmit(false);
  };

  return (
    <Modal
      title={`Update Order #${dataUpdate?.id}`}
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        form.resetFields();
        setOpenModalUpdate(false);
        setDataUpdate(null);
      }}
      okText="Update"
      cancelText="Cancel"
      okButtonProps={{ loading: isSubmit }}
      maskClosable={false}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item<FieldType> name="id" hidden>
          <input />
        </Form.Item>

        <Form.Item<FieldType>
          name="status"
          label="Order Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select
            placeholder="Select status"
            options={[
              { label: "Pending", value: "pending" },
              { label: "Processing", value: "processing" },
              { label: "Shipped", value: "shipped" },
              { label: "Delivered", value: "delivered" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateOrder;
