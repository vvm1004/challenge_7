import { useEffect } from "react";
import { App, Divider, Form, Input, Modal, Select } from "antd";
import type { FormProps } from "antd";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  updateUser,
  resetUpdate,
} from "@/redux/user/userSlice";

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
  const [form] = Form.useForm();
  const { message, notification } = App.useApp();
  const dispatch = useAppDispatch();
  const { isUpdateSuccess, loading, error } = useAppSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        name: dataUpdate.name.trim(),
        email: dataUpdate.email.trim(),
        phone: dataUpdate.phone.trim(),
        role: dataUpdate.role,
        avatar: dataUpdate.avatar?.trim() || "",
      });

    }
  }, [dataUpdate]);

  useEffect(() => {
    if (isUpdateSuccess) {
      message.success("User updated successfully");
      form.resetFields();
      setOpenModalUpdate(false);
      setDataUpdate(null);
      refreshTable();
      dispatch(resetUpdate());
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error,
      });
    }
  }, [error]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { id, ...rest } = values;

    const trimmedPayload = {
      ...rest,
      name: rest.name.trim(),
      phone: rest.phone.trim(),
      avatar: rest.avatar?.trim() || "",
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateUser({ id, data: trimmedPayload }));
  };

  const handleCancel = () => {
    setOpenModalUpdate(false);
    setDataUpdate(null);
    form.resetFields();
    dispatch(resetUpdate());
  };

  return (
    <Modal
      title="Update User"
      open={openModalUpdate}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Update"
      cancelText="Cancel"
      confirmLoading={loading}
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
        >
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUser;
