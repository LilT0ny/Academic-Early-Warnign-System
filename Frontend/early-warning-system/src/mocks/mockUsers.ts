export type MockUser = {
  id: string;
  email: string;
  name: string;
  password: string; // solo para mock
  role?: "admin" | "staff" | "viewer";
};

export const MOCK_USERS: MockUser[] = [
  {
    id: "u-1",
    email: "admin@ews.test",
    name: "Admin EWS",
    password: "Admin123",     // <- contraseña de demo
    role: "admin",
  },
  {
    id: "u-2",
    email: "docente@uni.edu",
    name: "Docente Prueba",
    password: "Docente123",
    role: "staff",
  },
];
