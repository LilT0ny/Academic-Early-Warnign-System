import React from "react";
import MainLayout from "../layouts/MainLayout";
import StudentsModule from "../modules/students/StudentsModule";

const StudentsPage: React.FC = () => {
  return (
    <MainLayout currentPage="students">
      <StudentsModule />
    </MainLayout>
  );
};

export default StudentsPage;
