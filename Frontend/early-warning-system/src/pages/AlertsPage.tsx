import React from "react";
import MainLayout from "../layouts/MainLayout";
import AlertsModule from "../modules/alerts/AlertsModule";

const AlertsPage: React.FC = () => {
  return (
    <MainLayout currentPage="alerts">
      <AlertsModule />
    </MainLayout>
  );
};

export default AlertsPage;
