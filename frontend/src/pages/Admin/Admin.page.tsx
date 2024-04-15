import Page from "../../components/Page/Page";
import PageContent from "../../components/Page/PageContent";
import PageHeader from "../../components/Page/PageHeader";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Tabs } from "../../components/Tabs";
import UserPage from "./User.tab";
import DataTab from "./Data.tab";

export const adminRoute = [
  {
    path: "users",
    element: <UserPage />,
  },
  {
    path: "data",
    element: <DataTab />,
  },
];

const adminTabs = adminRoute.map((route) => route.path);

export default function AdminPage() {
  const location = useLocation();
  const path = location.pathname.split("/")[3];
  const defaultIndex =
    adminTabs.findIndex((tab) => tab === path) > -1
      ? adminTabs.findIndex((tab) => tab === path)
      : 0;

  const navigate = useNavigate();

  return (
    <Page>
      <PageHeader title="Admin" />
      <PageContent>
        <Tabs
          index={defaultIndex}
          setIndex={(index) => {
            navigate("/dashboard/admin/" + adminTabs[index]);
          }}
          tabList={adminTabs}
        />
        <Outlet />
      </PageContent>
    </Page>
  );
}
