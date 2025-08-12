import React from "react";
import MainLayout from "../layouts/MainLayout";
import UploadExcelModule from "../modules/surveys/UploadExcelModule";

const UploadPage: React.FC = () => {
  return (
    <MainLayout currentPage="upload">
      <UploadExcelModule />
    </MainLayout>
  );
};
export default UploadPage;