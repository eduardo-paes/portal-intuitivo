import React from "react";
import {Link as RouterLink} from 'react-router-dom';
import api from '../../api'

import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

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

function UpdateSubject(props) {
    const {setDisciplina, disciplina, setEditSubject} = props;

    function updating() {
        setEditSubject(disciplina._id)
        setDisciplina(disciplina);
    }
    // Retorna o botaão
    return (
        <IconButton aria-label="update" color="primary" size="small" onClick={updating}>
            <EditIcon/>
        </IconButton>
    )
}

// Botão de Remoção
function DeleteSubject(props) {
    function removing() {
        if (window.confirm(`Quer remover a disciplina ${props.nome} permanentemente?`)) {
            api.removerDisciplina(props.id)
        }
    }

    return (
        <RouterLink to={"/configuracoes"}>
            <IconButton
                aria-label="delete"
                color="secondary"
                size="small"
                onClick={removing}>
                <DeleteIcon/>
            </IconButton>
        </RouterLink>
    )
}

export default function DisTable(props) {
    const {data, pushSubject, setID} = props;
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.head}>Nome</TableCell>
                        <TableCell className={classes.head}>Dia da Semana</TableCell>
                        <TableCell className={classes.head}>Funções</TableCell>
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
                                    <TableCell className={classes.row} component="th" scope="row">
                                        <UpdateSubject disciplina={row} setDisciplina={pushSubject} setEditSubject={setID}/>
                                        <DeleteSubject id={row._id} nome={row.nome}/>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}