import React from "react";
import { Alert, AlertTitle, Collapse, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface AlertMessageProps {
  type: "error" | "warning" | "info" | "success";
  title?: string;
  message: string;
  onClose?: () => void;
  closable?: boolean;
}

const AlertMessage: React.FC<AlertMessageProps> = ({
  type,
  title,
  message,
  onClose,
  closable = true,
}) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Collapse in={open}>
      <Alert
        severity={type}
        action={
          closable && (
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <Close fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{ mb: 2 }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
