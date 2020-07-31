import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 300,
        color: "#606161"
    },
    row: {
        color: "#606161"
    },
    head: {
        color: "#606161",
        fontWeight: "bold"
    }
});

const semana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

export default function DisTable(props) {
    const {data} = props;
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.head}>Nome</TableCell>
                        <TableCell className={classes.head}>Dia da Semana</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.map((row, index) => {
                            const {nome, diaSemana} = row;
                            return (
                                <TableRow key={index}>
                                    <TableCell className={classes.row} component="th" scope="row">{nome}</TableCell>
                                    <TableCell className={classes.row} component="th" scope="row">{semana[diaSemana]}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}