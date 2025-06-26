import { Card, Col, Row, Statistic, App } from "antd";
import CountUp from "react-countup";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchDashboardData } from "@/redux/dashboard/dashboardSlice";

const AdminDashboard = () => {
  const dispatch = useAppDispatch();
  const { countOrder, countUser, countProduct, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  const { notification } = App.useApp();

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, []);

  useEffect(() => {
    if (error) {
      notification.error({
        message: "Error",
        description: error,
      });
    }
  }, [error]);

  const formatter = (value: string | number | undefined) => (
    <CountUp end={Number(value || 0)} separator="," />
  );

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} loading={loading}>
          <Statistic
            title="Total Users"
            value={countUser}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} loading={loading}>
          <Statistic
            title="Total Orders"
            value={countOrder}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} loading={loading}>
          <Statistic
            title="Total Products"
            value={countProduct}
            formatter={formatter}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboard;
