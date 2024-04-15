import { Box, Card } from "@mui/joy";

export default function PageContent({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <>
      <Box
        component="main"
        className="MainContent"
        sx={(theme) => ({
          px: { xs: 2, md: 6 },
          pt: {
            xs: "calc(12px + var(--Header-height))",
            sm: "calc(12px + var(--Header-height))",
            md: 3,
          },
          pb: { xs: 2, sm: 2, md: 3 },
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          gap: 1,
        })}
      >
        <Card
          sx={{
            border: 0,
            minHeight: "calc(100vh - 160px)",
            marginTop: "-80px",
          }}
        >
          {children}
        </Card>
      </Box>
    </>
  );
}
