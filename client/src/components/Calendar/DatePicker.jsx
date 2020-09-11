import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
    const { selectedDate, setSelectedDate, label, name } = props;

    const handleDateChange = (date) => {
        setSelectedDate(preValue => ({
            ...preValue,
            [name]: date
        }));
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker"
                label={label}
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{ 'aria-label': 'change date' }}/>
        </MuiPickersUtilsProvider>
    );
}