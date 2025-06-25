import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { updateUserAPI } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (value: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (value: IUserTable | null) => void;
  dataUpdate: IUserTable | null;
}

type FieldType = {
  id: number;
  email: string;
  name: string;
  phone: string;
  role: "admin" | "customer";
  avatar: string;
};

const UpdateUser = ({
  openModalUpdate,
  setOpenModalUpdate,
  refreshTable,
  setDataUpdate,
  dataUpdate,
}: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        name: dataUpdate.name,
        email: dataUpdate.email,
        phone: dataUpdate.phone,
        role: dataUpdate.role,
        avatar: dataUpdate.avatar,
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, ...updatedFields } = values;

    setIsSubmitting(true);
    const res = await updateUserAPI(id, {
      ...updatedFields,
      updatedAt: new Date().toISOString(),
    });

    if (res && res.data) {
      message.success("User updated successfully");
      form.resetFields();
      setOpenModalUpdate(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      notification.error({
        message: "Error",
        description: res.message || "Failed to update user",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Modal
      title="Update User"
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalUpdate(false);
        setDataUpdate(null);
        form.resetFields();
      }}
      okText="Update"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
    >
      <Divider />

      <Form
        form={form}
        name="update-user-form"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType> name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item<FieldType>
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select role" }]}
        >
          <Select placeholder="Select role">
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="customer">Customer</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item<FieldType>
          label="Avatar URL"
          name="avatar"
          rules={[{ required: false, message: "Please enter avatar URL" }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
