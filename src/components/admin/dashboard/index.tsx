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

  useEffect(() => {
    const initDashboard = async () => {
      const res = await getDashboardAPI();
      if (res && res.success && res.data) {
        setDataDashboard({
          countUser: res.data.countUser ?? 0,
          countBook: res.data.countBook ?? 0,
          countOrder: res.data.countOrder ?? 0,
        });
      }
    };
    initDashboard();
  }, []);

  const formatter = (value: any) => <CountUp end={value} separator="," />;

  return (
    <Row gutter={[40, 40]}>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Total Users"
            value={dataDashboard.countUser}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
          <Statistic
            title="Total Orders"
            value={dataDashboard.countOrder}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col span={8}>
        <Card bordered={false}>
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
