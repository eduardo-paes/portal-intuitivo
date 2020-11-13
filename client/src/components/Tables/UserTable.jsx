import React, { useState } from "react";
import {Link as RouterLink} from 'react-router-dom';
import api from '../../api'

// -- Material UI - Table
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

// -- Material UI - Icons
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import DeleteIcon from '@material-ui/icons/Delete';
import UserDialogFilter from "../Dialogs/UserDialogFilter";

// Botão de Atualização
function UpdateUser (props) {
    // Retorna o botaão
    return (
        <RouterLink to={"/controle-usuario/update/" + props.id}>
            <IconButton aria-label="update" color="primary" size="small">
                <EditIcon/>
            </IconButton>
        </RouterLink>
    )
}

// Botão de Remoção
function DeleteUser(props) {
    function removing() {
        if (window.confirm(`Quer remover o usuário ${props.nome} permanentemente?`)) {
            api.removerUsuario(props.id)
            props.setMount(preValue => ({...preValue, wasChanged: true}));
        }
    }

    return (
        <RouterLink to={"/controle-usuario/list"}>
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

// -- Funções auxiliares para Ordenação
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) 
            return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

// -- Componentes das Células de Cabeçalho
const headCells = [
    {
        id: 'nome',
        label: 'Nome'
    }, {
        id: 'email',
        label: 'E-mail'
    }, {
        id: 'acesso',
        label: 'Tipo de Acesso'
    }, {
        id: 'funcoes',
        label: 'Funções'
    }
];

const phoneHeadCells = [
    {
        id: 'nome',
        label: 'Nome'
    }, {
        id: 'funcoes',
        label: ''
    }
]

// -- Table: Head
function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort, width} = props;
    var cells = !width ? headCells : phoneHeadCells;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {
                    cells.map((headCell) => (
                        <TableCell
                            className={classes.row}
                            key={headCell.id}
                            align={'left'}
                            padding={'default'}
                            sortDirection={order}>
                            {
                                (headCell.id !== "funcoes")

                                    ? <TableSortLabel
                                            active={orderBy === headCell.id}
                                            direction={orderBy === headCell.id
                                                ? order
                                                : 'asc'}
                                            className={classes.row}
                                            onClick={createSortHandler(headCell.id)}>
                                            {headCell.label}
                                            {
                                                orderBy === headCell.id
                                                    ? (
                                                        <span className={classes.visuallyHidden}>
                                                            {
                                                                order === 'desc'
                                                                    ? 'sorted descending'
                                                                    : 'sorted ascending'
                                                            }
                                                        </span>
                                                    )
                                                    : null
                                            }
                                        </TableSortLabel>
                                    : <div>{headCell.label}</div>
                            }
                        </TableCell>
                    ))
                }
            </TableRow>
        </TableHead>
    );
}

// -- Definição de Funções do Cabeçalho
EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes
        .oneOf(['asc', 'desc'])
        .isRequired,
    orderBy: PropTypes.string.isRequired
};

// -- Toolbar Styles
const useToolbarStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
      color: "#606161",
    },
  }));

// -- Toolbar
const EnhancedTableToolbar = (props) => {
    const { filter, setFilter, filterDialog, setFilterDialog, isCleaned, setIsCleaned } = props;
    const classes = useToolbarStyles();

    // -- Limpa o filtro
    function clearFilter() {
        setFilter({ 
            nome: '',
            email: '',
            acesso: '',
        });
        setIsCleaned(true);
    }

    return (
    <Toolbar className={clsx(classes.root)}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Listagem Total de Usuários
        </Typography>

        <div hidden={isCleaned} >
            <Tooltip title="Limpar filtro" hidden={isCleaned}>
                <IconButton aria-label="filter list" color="secondary" onClick={() => clearFilter()}>
                    <ClearAllIcon />
                </IconButton>
            </Tooltip>
        </div>

        <Tooltip title="Filtrar lista">
            <IconButton aria-label="filter list" onClick={() => setFilterDialog(true)}>
                <FilterListIcon />
            </IconButton>
        </Tooltip>
    
        <UserDialogFilter 
            filter={filter}
            setFilter={setFilter}
            open={filterDialog}
            setOpen={setFilterDialog}
            setIsCleaned={setIsCleaned}
        />
    </Toolbar>
    );
};

// -- Styles: Tabela-Body
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        fontFamily: "apertura, sans-serif",
        color: "#606161"
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2)
    },
    row: {
        color: "#606161"
    },
    table: {
        minWidth: "18.75rem",
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    }
}));

export default function EnhancedTable(props) {
    const {data, setMount, filterDialog, setFilterDialog, filter, setFilter} = props;

    const theme = useTheme();
    const classes = useStyles();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isCleaned, setIsCleaned] = useState(true);

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('topicoID.topico');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // -- Solicita Ordenação
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(
            isAsc
                ? 'desc'
                : 'asc'
        );
        setOrderBy(property);
    };

    // -- Funções de Paginação
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // -- Rows vazias para complementação
    const emptyRows = rowsPerPage - Math.min( rowsPerPage, data.length - page * rowsPerPage );

    // -- Tabela: Body
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar 
                    filter={filter} 
                    setFilter={setFilter} 
                    isCleaned={isCleaned}
                    setIsCleaned={setIsCleaned}
                    filterDialog={filterDialog} 
                    setFilterDialog={setFilterDialog}/>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table">
                        <EnhancedTableHead
                            classes={classes}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            width={smScreen}/>
                        <TableBody>
                            {
                                (data.length > 0) && stableSort(data, getComparator(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map(row => {
                                        let auxName = (row.nome.toLowerCase().includes(filter.nome.toLowerCase()) || filter.nome === '') ? true : false;
                                        let auxEmail = (row.email.toLowerCase().includes(filter.email.toLowerCase()) || filter.email === '') ? true : false;
                                        let auxAccess = (row.acesso === filter.acesso || filter.acesso === '') ? true : false;

                                        if (auxName && auxEmail && auxAccess) {
                                            return (
                                                <TableRow hover={true} tabIndex={-1} key={row._id}>

                                                    <TableCell className={classes.row} align="left">{row.nome}</TableCell>
                                                    {!smScreen && <TableCell className={classes.row} align="left">{row.email}</TableCell>}
                                                    {!smScreen && <TableCell className={classes.row} align="left">{row.acesso}</TableCell>}
                                                    <TableCell align="left">
                                                        <UpdateUser id={row._id}/>
                                                        <DeleteUser id={row._id} nome={row.nome} setMount={setMount}/>
                                                    </TableCell>

                                                </TableRow>
                                            );
                                        }

                                        // eslint-disable-next-line
                                        return;
                                    })
                            }
                            {
                                emptyRows > 0 && (
                                    <TableRow
                                        style={{
                                            height: (33) * emptyRows
                                        }}>
                                        <TableCell colSpan={6}/>
                                    </TableRow>
                                )
                            }
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Footer: Paginação */}
                <TablePagination
                    className={classes.row}
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}/>
            </Paper>
        </div>
    );
}
