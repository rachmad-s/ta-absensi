import { Box } from "@mui/joy";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar/Sidebar";

export default function DashboardLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100dvh" }}>
      <Header />
      <Sidebar />
      <Outlet />
    </Box>
  );
}
