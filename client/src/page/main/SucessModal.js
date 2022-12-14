import React from "react";
import "./Modal.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { WorkspaceButton } from "../workspace/AddWorkspace";
import { ThemeProvider } from "@mui/material";
import { theme } from "../../Config";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const SucessModal = (props) => {
  const { open, close } = props;

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Modal
          open={open}
          onClose={close}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: 350 }}>
            <Box
              id="modal-modal-description"
              sx={{ display: "flex", justifyContent: "center" }}
            >
              {props.children}
            </Box>
            {close ? (
              <Typography
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
                mt={2}
              >
                <WorkspaceButton
                  sx={{ display: "flex", justifyContent: "center" }}
                  variant="contained"
                  onClick={close}
                >
                  확인
                </WorkspaceButton>
              </Typography>
            ) : (
              <></>
            )}
          </Box>
        </Modal>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default SucessModal;
