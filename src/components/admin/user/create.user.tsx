import { useState } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { checkEmailDuplicateAPI, createUserAPI } from "@/services/api";
import axios from "axios";

interface IProps {
  openModalCreate: boolean;
  setOpenModalCreate: (value: boolean) => void;
  refreshTable: () => void;
}

type FieldType = {
  name: string;
  email: string;
  phone: string;
  role: "admin" | "customer";
  avatar: string;
};

const CreateUser = ({ openModalCreate, setOpenModalCreate, refreshTable }: IProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
  const { email } = values;

  try {
    //  Step 1: Call API to check email
    const check = await checkEmailDuplicateAPI(email);
    if (!check.success) {
      notification.error({
        message: "Error",
        description: check.message || "Failed to check email",
      });
      return;
    }

    if (check.isDuplicate) {
      notification.error({
        message: "Email already exists",
        description: `A user with email ${email} already exists.`,
      });
      return;
    }

    //  Step 2: Create new user
    const payload = {
      ...values,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    const res = await createUserAPI(payload);

    if (res.success && res.data) {
      message.success("User created successfully");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
    } else {
      notification.error({
        message: "Error",
        description: res.message || "Failed to create user",
      });
    }
  } catch (error: any) {
    notification.error({
      message: "Error",
      description: error.message || "Something went wrong",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Modal
      title="Create New User"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={() => {
        setOpenModalCreate(false);
        form.resetFields();
      }}
      okText="Create"
      cancelText="Cancel"
      confirmLoading={isSubmitting}
    >
      <Divider />

      <Form
        form={form}
        layout="vertical"
        name="create-user-form"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Full Name"
          name="name"
          rules={[{ required: true, message: "Please enter full name" }]}
        >
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
          rules={[{ required: true, message: "Please select a role" }]}
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

export default CreateUser;
