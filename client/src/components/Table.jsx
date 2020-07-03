import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles({
    table: {
        minWidth: 650
    }
});

export default function SimpleTable(usuarios) {
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const classes = useStyles();

    return (
        <div className={classes.root}>
        <Paper className={classes.paper}>
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Nome</TableCell>
                        <TableCell align="center">E-mail</TableCell>
                        <TableCell align="center">Tipo de Acesso</TableCell>
                        <TableCell align="center">Funções</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {usuarios
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((usuario) => (
                            <TableRow key={usuario.name}>
                                <TableCell component="th" scope="username">{usuario.nome}</TableCell>
                                <TableCell align="left">{usuario.email}</TableCell>
                                <TableCell align="left">{usuario.acesso}</TableCell>
                                <TableCell align="center">Funções</TableCell>
                            </TableRow>
                        ))}
                </TableBody>

            </Table>
        </TableContainer>
        <TablePagination
            component="div"
            count={100}
            page={page}
            onChangePage={handleChangePage}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={handleChangeRowsPerPage}/>
        </Paper>
        </div>
    );
}