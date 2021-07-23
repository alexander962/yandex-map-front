import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { TextField, MenuItem, Button } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./EditeModal.scss";

export const EditModal = (props) => {
  const [nameEdit, setNameEdit] = useState(props.itemEdit.name);
  const [longitudeEdit, setLongitudeEdit] = useState(props.itemEdit.longitude);
  const [latitudeEdit, setLatitudeEdit] = useState(props.itemEdit.latitude);

  let editParams = {
    item: props.itemEdit,
    nameEdit,
    longitudeEdit,
    latitudeEdit
  }

  return (
    <div>
      <Dialog
        open={props.editMod}
        onClose={() => props.setEditMod(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Изменить координату</DialogTitle>
        <DialogContent>
          <DialogContentText>Название:</DialogContentText>
          <TextField
            type="text"
            id="nameInput"
            value={nameEdit}
            variant="outlined"
            onChange={(e) => setNameEdit(e.target.value)}
            autoFocus
            margin="dense"
            fullWidth
          />
          <DialogContentText>Широта:</DialogContentText>
          <TextField
            type="text"
            id="nameInput"
            value={longitudeEdit}
            variant="outlined"
            onChange={(e) => setLongitudeEdit(e.target.value)}
            margin="dense"
            fullWidth
          />
          <DialogContentText>Долгота:</DialogContentText>
          <TextField
            type="text"
            id="nameInput"
            value={latitudeEdit}
            variant="outlined"
            onChange={(e) => setLatitudeEdit(e.target.value)}
            margin="dense"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => props.setEditMod(false)}
            color="primary"
            id="btnCancel"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              props.editEl(
                editParams
              )
            }
            color="primary"
            id="btnDelete"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
