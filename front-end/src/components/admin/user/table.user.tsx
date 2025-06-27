import { useCallback, useEffect, useRef, useState } from "react";
import { App, Avatar, Button, Popconfirm, Tag } from "antd";
import { ProTable } from "@ant-design/pro-components";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  DeleteTwoTone,
  EditTwoTone,
  ExportOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { CSVLink } from "react-csv";

import DetailUser from "./detail.user";
import CreateUser from "./create.user";
import UpdateUser from "./update.user";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  deleteUser,
  fetchListUsers,
  resetDelete,
} from "@/redux/user/userSlice";
import { broadcastUserChange, userChannel } from "utils/broadcast";

const TableUser = () => {
  const dispatch = useAppDispatch();
  const actionRef = useRef<ActionType>();

  const { listUsers, total, loading, isDeleteSuccess, error } = useAppSelector(
    (state) => state.user
  );

  // State cho phân trang, sắp xếp, tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortField, setSortField] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  // Modal & detail state
  const [openViewDetail, setOpenViewDetail] = useState(false);
  const [dataViewDetail, setDataViewDetail] = useState<IUserTable | null>(null);

  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalUpdate, setOpenModalUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

  const { message, notification } = App.useApp();

  const fetchData = useCallback(() => {
    const params: Record<string, any> = {
      _page: currentPage,
      _per_page: pageSize,
    };

    if (sortField) {
      params._sort = sortField;
    }

    if (searchName) {
      params.name = searchName;
    }

    if (searchEmail) {
      params.email = searchEmail;
    }

    dispatch(fetchListUsers(params));
  }, [currentPage, pageSize, sortField, searchName, searchEmail, dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (isDeleteSuccess) {
      message.success("Delete user successfully");
      fetchData();
      dispatch(resetDelete());
      broadcastUserChange();
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error,
      });
    }
  }, [error]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "refresh-user-table") {
        setCurrentPage(1);
        setOpenModalUpdate(false);
      }
    };


    userChannel.addEventListener("message", handleMessage);
    return () => {
      userChannel.removeEventListener("message", handleMessage);
    };
  }, []);

  const handleDeleteUser = (id: number) => {
    dispatch(deleteUser(id));
  };

  const columns: ProColumns<IUserTable>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
      responsive: ["md"],
    },
    {
      title: "User ID",
      dataIndex: "id",
      hideInSearch: true,
      render: (_, entity) => (
        <a
          onClick={() => {
            setDataViewDetail(entity);
            setOpenViewDetail(true);
          }}
          href="#"
        >
          {entity.id}
        </a>
      ),
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      render: (_, record) => {
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          record.name || "User"
        )}&background=random`;

        return (
          <Avatar
            size={40}
            src={record.avatar || defaultAvatar}
            style={{ objectFit: "cover" }}
          />
        );
      },
      hideInSearch: true,
      responsive: ["md"],
    },
    {
      title: "Full Name",
      dataIndex: "name",
      responsive: ["md"],
    },
    {
      title: "Email",
      dataIndex: "email",
      copyable: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      valueType: "dateTime",
      sorter: true,
      sortDirections: ["ascend"],
      responsive: ["md"],
    },
    {
      title: "Action",
      hideInSearch: true,
      render: (_, entity) => (
        <>
          <EditTwoTone
            twoToneColor="#f57800"
            style={{ cursor: "pointer", marginRight: 15 }}
            onClick={() => {
              setDataUpdate(entity);
              setOpenModalUpdate(true);
            }}
          />
          <Popconfirm
            title="Confirm user deletion"
            description="Are you sure you want to delete this user?"
            onConfirm={() => {
              if (entity.id !== undefined) {
                handleDeleteUser(entity.id);
              } else {
                notification.error({
                  message: "Invalid user",
                  description: "Cannot delete user with missing ID",
                });
              }
            }}
            okText="Confirm"
            cancelText="Cancel"
            okButtonProps={{ loading: loading }}
          >
            <DeleteTwoTone
              twoToneColor="#ff4d4f"
              style={{ cursor: "pointer" }}
            />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <ProTable<IUserTable>
        columns={columns}
        actionRef={actionRef}
        dataSource={listUsers}
        loading={loading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          pageSizeOptions: ['5', '10', '20', '50', '100'],
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} trên ${total} rows`,
          onChange: (page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          },
        }}
        onChange={(_, __, sorter: any) => {
          if (sorter?.field) {
            setSortField(sorter.field);
          } else {
            setSortField("");
          }
        }}
        onSubmit={(values) => {
          setSearchName(values.name || "");
          setSearchEmail(values.email || "");
          setCurrentPage(1);
        }}
        onReset={() => {
          setSearchName("");
          setSearchEmail("");
          setCurrentPage(1);
        }}
        headerTitle="Users Table"
        toolBarRender={() => [
          <CSVLink data={listUsers || []} filename="export-user.csv">
            <Button icon={<ExportOutlined />} type="primary">
              Export
            </Button>
          </CSVLink>,
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setOpenModalCreate(true)}
            key="add-new"
          >
            Add New
          </Button>,
        ]}
      />


      <DetailUser
        openViewDetail={openViewDetail}
        setOpenViewDetail={setOpenViewDetail}
        dataViewDetail={dataViewDetail}
        setDataViewDetail={setDataViewDetail}
      />

      <CreateUser
        openModalCreate={openModalCreate}
        setOpenModalCreate={setOpenModalCreate}
        refreshTable={fetchData}
      />

      <UpdateUser
        openModalUpdate={openModalUpdate}
        setOpenModalUpdate={setOpenModalUpdate}
        refreshTable={fetchData}
        setDataUpdate={setDataUpdate}
        dataUpdate={dataUpdate}
      />
    </>
  );
};

export default TableUser;
