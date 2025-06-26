import { useEffect } from "react";
import { App, Divider, Form, Input, InputNumber, Modal, Select } from "antd";
import type { FormProps } from "antd";

import { checkEmailDuplicateAPI } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  createNewUser,
  resetCreate,
} from "@/redux/user/userSlice";

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

const CreateUser = ({
  openModalCreate,
  setOpenModalCreate,
  refreshTable,
}: IProps) => {
  const { message, notification } = App.useApp();
  const dispatch = useAppDispatch();
  const { isCreateSuccess, error, loading } = useAppSelector(
    (state) => state.user
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (isCreateSuccess) {
      message.success("User created successfully");
      form.resetFields();
      setOpenModalCreate(false);
      refreshTable();
      dispatch(resetCreate());
    }
  }, [isCreateSuccess]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error,
      });
    }
  }, [error]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const trimmedValues = {
      ...values,
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      avatar: values.avatar?.trim() || "",
    };

    const { email } = trimmedValues;

    try {
      // Kiểm tra trùng email
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

      const payload = {
        ...trimmedValues,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch(createNewUser(payload));
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong",
      });
    }
  };


  const handleCancel = () => {
    setOpenModalCreate(false);
    form.resetFields();
    dispatch(resetCreate());
  };

  return (
    <Modal
      title="Create New User"
      open={openModalCreate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Create"
      cancelText="Cancel"
      confirmLoading={loading}
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
          rules={[
            { required: true, message: "Please enter phone number" },
            {
              pattern: /^[0-9]{1,11}$/,
              message: "Phone number must contain only numbers and be up to 11 digits",
            },
          ]}
        >
          <Input maxLength={11} />
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
        >
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUser;
