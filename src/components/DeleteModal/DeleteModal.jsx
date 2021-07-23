import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Slide from "@material-ui/core/Slide";
import "./DeleteModal.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const DeleteModal = (props) => {
  const handleDelete = () => {
    props.setDeleteMod(false);
    props.deleteEl(props.idDel);
  }

  return (
    <div>
      <Dialog
        open={props.deleteMod}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => props.setDeleteMod(false)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">
          {"Удалить координату?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Вы действительно хотите удалить координату?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => props.setDeleteMod(false)}
            color="primary"
            id="btnCancel"
          >
            Cancel
          </Button>  
          <Button
            onClick={() => handleDelete()}
            color="primary"
            id="btnDelete"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
