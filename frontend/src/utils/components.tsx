import { Sheet, Typography } from "@mui/joy";
import Page from "../components/Page/Page";

export const Error403 = () => {
  return (
    <Page>
      <Sheet
        variant="soft"
        color="neutral"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Typography level="h1">403</Typography>
        <Typography level="body-lg">Forbidden</Typography>
      </Sheet>
    </Page>
  );
};

export const Error404 = () => {
  return (
    <Page>
      <Sheet
        variant="soft"
        color="neutral"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <Typography level="h1">404</Typography>
        <Typography level="body-lg">Not Found</Typography>
      </Sheet>
    </Page>
  );
};
