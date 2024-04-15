import { CheckCircle, Error } from "@mui/icons-material";
import { Button, Snackbar } from "@mui/joy";
import React, { useContext } from "react";

export const ToastContext = React.createContext({
  fire: (toast: Toast) => {},
});

interface Toast {
  error?: boolean;
  message: string;
}

export const ToastProvider = (props: React.PropsWithChildren) => {
  const [toast, setToasts] = React.useState<Toast>();
  const [open, setOpen] = React.useState(false);

  const fire = (toast: Toast) => {
    setToasts({
      error: toast.error || false,
      message: toast.message,
    });
    setOpen(true);
  };

  return (
    <ToastContext.Provider value={{ fire }}>
      {props.children}
      {toast && (
        <Snackbar
          size="lg"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={3000}
          open={open}
          variant={"soft"}
          color={toast.error ? "danger" : "success"}
          startDecorator={toast.error ? <Error /> : <CheckCircle />}
          onClose={() => {
            setOpen(false);
          }}
          endDecorator={
            <Button
              onClick={() => setOpen(false)}
              size="sm"
              variant="plain"
              color={toast.error ? "danger" : "success"}
            >
              Tutup
            </Button>
          }
        >
          {toast.message}
        </Snackbar>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const { fire } = useContext(ToastContext);
  return fire;
};
