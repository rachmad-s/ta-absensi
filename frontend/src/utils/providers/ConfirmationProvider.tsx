import { ErrorOutline } from "@mui/icons-material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import React, { useContext } from "react";

interface ConfirmationProps {
  title?: string;
  message?: string | JSX.Element;
  buttonLabel?: string;
  buttonLoading?: boolean;
  onConfirm: () => Promise<any>;
}

interface ConfirmationProviderContextInterface {
  openConfirmation: (props: ConfirmationProps) => void;
}

export const ConfirmationProviderContext =
  React.createContext<ConfirmationProviderContextInterface>({
    openConfirmation: () => {},
  });

export const ConfirmationProvider = (props: React.PropsWithChildren) => {
  const [confirmation, setConfirmation] = React.useState<JSX.Element | null>(
    null
  );

  const onClose = () => setConfirmation(null);

  const openConfirmation = ({
    title = "Peringatan",
    message = "Apakah anda yakin untuk melanjutkan?",
    buttonLabel = "Lanjut",
    buttonLoading = false,
    onConfirm,
  }: ConfirmationProps) => {
    setConfirmation(
      <Modal open={true} onClose={onClose}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <ErrorOutline />
            {title}
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: "1rem" }}>{message}</DialogContent>
          <DialogActions>
            <Button
              loading={buttonLoading}
              variant="solid"
              color="danger"
              onClick={async () => {
                await onConfirm();
                onClose();
              }}
            >
              {buttonLabel}
            </Button>
            <Button variant="plain" color="neutral" onClick={onClose}>
              Tutup
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    );
  };

  return (
    <ConfirmationProviderContext.Provider value={{ openConfirmation }}>
      {props.children}
      {confirmation}
    </ConfirmationProviderContext.Provider>
  );
};

export const useConfirmationDialog = () =>
  useContext(ConfirmationProviderContext);
