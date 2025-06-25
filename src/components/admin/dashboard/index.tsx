import { getDashboardAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const AdminDashboard = () => {
  const [dataDashboard, setDataDashboard] = useState({
    countOrder: 0,
    countUser: 0,
    countBook: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initDashboard = async () => {
      setLoading(true);
      const res = await getDashboardAPI();
      if (res && res.success && res.data) {
        setDataDashboard({
          countUser: res.data.countUser ?? 0,
          countBook: res.data.countBook ?? 0,
          countOrder: res.data.countOrder ?? 0,
        });
      }
      setLoading(false);
    };
    initDashboard();
  }, []);

  const formatter = (value: any) => <CountUp end={value} separator="," />;

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} loading={loading}>
          <Statistic
            title="Total Users"
            value={dataDashboard.countUser}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} loading={loading}>
          <Statistic
            title="Total Orders"
            value={dataDashboard.countOrder}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8}>
        <Card bordered={false} loading={loading}>
          <Statistic
            title="Total Books"
            value={dataDashboard.countBook}
            formatter={formatter}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboard;
