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
        minWidth: "18.75rem",
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

function UpdateSubject(props) {
    const {setTag, tag, setEditTag, setMount} = props;

    function updating() {
        setEditTag(tag._id)
        setTag(tag);
        setMount(preValue => ({...preValue, tag: true}));
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
    const {id, nome, setMount} = props;
    function removing() {
        if (window.confirm(`Quer remover a tag ${nome} permanentemente?`)) {
            api.removerTag(id)
            setMount(preValue => ({...preValue, tag: true}));
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
    const {data, pushTag, setTagID, setMount} = props;
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell className={classes.head}>Nome</TableCell>
                        <TableCell className={classes.head}>Disciplina</TableCell>
                        <TableCell className={classes.head}>Funções</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        data.map((row, index) => {
                            const {nome, disciplina} = row;
                            return (
                                <TableRow key={index}>
                                    <TableCell className={classes.row} component="th" scope="row">{nome}</TableCell>
                                    <TableCell className={classes.row} component="th" scope="row">{disciplina[0].nome}</TableCell>
                                    <TableCell className={classes.row} component="th" scope="row">
                                        <UpdateSubject tag={row} setTag={pushTag} setMount={setMount} setEditTag={setTagID}/>
                                        <DeleteSubject id={row._id} nome={row.nome} setMount={setMount}/>
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