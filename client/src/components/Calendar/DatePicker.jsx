import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/pt-br";

export default function MaterialUIPickers(props) {
    const { selectedDate, setSelectedDate, label, name, setMount } = props;
    const dateFormatter = str => { return str }

    const handleDateChange = (date) => {
        let aux = moment(date._d).format("YYYY/MM/DDT07:00:00.000Z");
        console.log(aux);
        setSelectedDate(preValue => ({
            ...preValue,
            [name]: new Date(aux)
        }));
        setMount(preValue => ({...preValue, anoLetivo: true}));
    };


    return (
        <MuiPickersUtilsProvider locale="pt-br" libInstance={moment} utils={MomentUtils}>
            <KeyboardDatePicker
                autoOk={true}
                disableToolbar={true}
                variant="inline"
                format="DD/MM/YYYY"
                margin="normal"
                label={label}
                name={name}
                value={selectedDate}
                inputValue={moment(selectedDate).format("DD/MM/YYYY")}
                onChange={handleDateChange}
                rifmFormatter={dateFormatter}
                KeyboardButtonProps={{ 'aria-label': 'change date' }}/>
        </MuiPickersUtilsProvider>
    );
}