import * as React from "react";
import { Drawer as JoyDrawer } from "@mui/joy";
import Button, { ButtonProps } from "@mui/joy/Button";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import ModalClose from "@mui/joy/ModalClose";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";

interface ComponentProps {
  title: string;
  onDrawerClose: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  primaryButton?: {
    label?: string;
    onClick: () => void;
    props?: ButtonProps;
  };
  secondaryButton?: {
    label?: string;
    onClick: () => void;
  };
}

export default function Drawer({
  title,
  onDrawerClose = () => {},
  primaryButton,
  secondaryButton,
  children,
  open,
  setOpen,
}: React.PropsWithChildren<ComponentProps>) {
  const onClose = () => {
    onDrawerClose();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <JoyDrawer
        size="md"
        variant="plain"
        open={open}
        anchor="right"
        onClose={onClose}
        slotProps={{
          content: {
            sx: (theme) => ({
              bgcolor: "transparent",
              p: { md: 3, sm: 0 },
              boxShadow: "none",
              width: "35%",
            }),
          },
        }}
      >
        <Sheet
          sx={(theme) => ({
            bgcolor: theme.vars.palette.neutral[50],
            borderRadius: "md",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
            overflow: "auto",
          })}
        >
          <DialogTitle>{title}</DialogTitle>
          <ModalClose />
          <Divider sx={{ mt: "auto" }} />
          <DialogContent sx={{ gap: 2 }}>{children}</DialogContent>

          <Divider sx={{ mt: "auto" }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            useFlexGap
            spacing={1}
          >
            {secondaryButton && (
              <Button
                variant="outlined"
                color="neutral"
                onClick={secondaryButton.onClick}
              >
                {secondaryButton.label || "Reset"}
              </Button>
            )}
            <Button
              {...primaryButton?.props}
              onClick={() => {
                primaryButton?.onClick && primaryButton.onClick();
              }}
            >
              {primaryButton?.label || "Simpan"}
            </Button>
          </Stack>
        </Sheet>
      </JoyDrawer>
    </React.Fragment>
  );
}
