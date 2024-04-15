import { Sheet } from "@mui/joy";

export default function Page({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <Sheet
      sx={(theme) => ({
        background: theme.palette.neutral[100],
        width: "100%",
        minHeight: "100vh",
      })}
    >
      {children}
    </Sheet>
  );
}
