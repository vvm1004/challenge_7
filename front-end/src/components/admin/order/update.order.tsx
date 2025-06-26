import { useEffect } from "react";
import { App, Form, Modal, Select } from "antd";
import type { FormProps } from "antd";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  resetOrderUpdate,
  updateOrder,
} from "@/redux/order/orderSlice";
import { broadcastOrderChange } from "@/utils/broadcast";

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
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const { loading, isUpdateSuccess, error } = useAppSelector(
    (state) => state.order
  );

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        id: dataUpdate.id,
        status: dataUpdate.status,
      });
    }
  }, [dataUpdate]);

  useEffect(() => {
    if (isUpdateSuccess) {
      message.success("Order updated successfully");
      form.resetFields();
      setDataUpdate(null);
      setOpenModalUpdate(false);
      refreshTable();
      dispatch(resetOrderUpdate());
      
      broadcastOrderChange(); 
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

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const payload = {
      status: values.status,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateOrder({ id: values.id, data: payload }));
  };

  const getNextStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["processing"];
      case "processing":
        return ["shipped"];
      case "shipped":
        return ["delivered"];
      case "delivered":
        return []; 
      default:
        return [];
    }
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
      okButtonProps={{ loading: loading }}
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
            placeholder="Select next status"
            disabled={dataUpdate?.status === "delivered"}
            options={getNextStatuses(dataUpdate?.status || "pending").map((status) => ({
              label: status.charAt(0).toUpperCase() + status.slice(1),
              value: status,
            }))}
          />

        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateOrder;
