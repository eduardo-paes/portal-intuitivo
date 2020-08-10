import React from 'react';

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch
} from '@material-ui/core/';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function FormDialog(props) {
    const {open, handleDialog, date, setDate, addEvent} = props;
    const {title, start, allDay} = date;

    function handleChange (event) {
      const {name, value} = event.target;
      setDate(preValue => ({
        ...preValue,
        [name]: value
      }));
    }

    function checking (event) {
      const {name, checked} = event.target;
      setDate(preValue => ({
        ...preValue,
        [name]: checked
      }));
    }

    return (
      <Dialog 
        open={open} 
        onClose={handleDialog} 
        aria-labelledby="form-dialog-title">
          <DialogTitle 
            id="form-dialog-title">Definir Evento
          </DialogTitle>

          <DialogContent>
            <TextField
              autoFocus={true}
              margin="dense"
              name="title"
              label="Título"
              type="title"
              value={title}
              variant="outlined"
              onChange={handleChange}
              fullWidth={true}/>
              
             <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                  disableToolbar={true}
                  variant="inline"
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date picker inline"
                  value={start}
                  onChange={handleChange}
                  // fullWidth={true}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
             </MuiPickersUtilsProvider>

            <FormControlLabel 
              control={
                <Switch
                  autoFocus={true}
                  checked={allDay}
                  onChange={checking}
                  name="allDay"
                  color="primary"/>} 
              label="Dia inteiro" />

          {/* {console.log(date)} */}
          </DialogContent>
          <DialogActions>
              <Button onClick={handleDialog} color="primary">
                  Cancelar
              </Button>
              <Button onClick={addEvent} color="primary">
                  Adicionar
              </Button>
          </DialogActions>
      </Dialog>
    );
}

export default FormDialog;