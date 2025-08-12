import React from "react";
import MainLayout from "../layouts/MainLayout";
import ReportsModule from "../modules/reports/ReportsModule";

const ReportsPage: React.FC = () => {
  return (
    <MainLayout currentPage="reports">
      <ReportsModule />
    </MainLayout>
  );
};

export default ReportsPage;
