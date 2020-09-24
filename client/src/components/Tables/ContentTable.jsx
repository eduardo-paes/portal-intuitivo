import React, { useState } from "react";
import {Link as RouterLink} from 'react-router-dom';
import api from '../../api'

import { ContentDialogForm } from "../"

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
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FilterListIcon from '@material-ui/icons/FilterList';
import ClearAllIcon from '@material-ui/icons/ClearAll';

// Botão para visualização do conteúdo
function ContentVisualization (props) {
    const { open, setOpen, setId, setTitulo, ID, nome } = props;
    return (
        <IconButton 
            aria-label="visualization" 
            color="primary" 
            size="small"
            onClick={() => {
                setOpen(!open);
                setId(ID);
                setTitulo(nome);
            }}> 
            <VisibilityIcon/> 
        </IconButton>
    )
}

// Botão de Atualização
function UpdateContent (props) {
    // Retorna o botão
    return (
        <RouterLink to={"/controle-conteudo/update/" + props.id}>
            <IconButton aria-label="update" color="primary" size="small">
                <EditIcon/>
            </IconButton>
        </RouterLink>
    )
}

// Botão de Remoção
function DeleteContent(props) {
    function removing() {
        if (window.confirm(`Quer remover o conteúdo ${props.nome} permanentemente?`)) {
            api.removerConteudo(props.id)
            props.setMount(preValue => ({...preValue, wasChanged: true}));
        }
    }

    return (
        <RouterLink to={"/controle-conteudo"}>
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
    if (orderBy === 'disciplinaID.nome') {
        if (b.disciplinaID.nome < a.disciplinaID.nome) {
            return -1;
        }
        if (b.disciplinaID.nome > a.disciplinaID.nome) {
            return 1;
        }
        return 0;
    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }    
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
        id: 'area',
        label: 'Área'
    }, {
        id: 'disciplinaID.nome',
        label: 'Disciplina'
    }, {
        id: 'topico',
        label: 'Tópico'
    }, {
        id: 'numeracao',
        label: 'Numeração'
    }, {
        id: 'conteudo',
        label: 'Conteúdo'
    }
];

const phoneHeadCells = [
    {
        id: 'disciplina',
        label: 'Disciplina'
    }, {
        id: 'conteudo',
        label: 'Conteúdo'
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
                                (headCell.id !== "conteudo")

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
    const { filter, setFilter, filterDialog, setFilterDialog } = props;
    const classes = useToolbarStyles();

    // -- Limpa o filtro
    function clearFilter() {
        setFilter({ 
            area: "",
            disciplinaID: "",
            numeracao: ""
        });
    }

    return (
    <Toolbar className={clsx(classes.root)}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Lista de Tópicos
        </Typography>

        <Tooltip title="Limpar filtro">
            <IconButton aria-label="filter list" color="secondary" onClick={() => clearFilter()}>
                <ClearAllIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Filtrar lista">
            <IconButton aria-label="filter list" onClick={() => setFilterDialog(true)}>
                <FilterListIcon />
            </IconButton>
        </Tooltip>

        <ContentDialogForm 
            filter={filter}
            setFilter={setFilter}
            open={filterDialog}
            setOpen={setFilterDialog}
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
    const { data, filterDialog, setFilterDialog, setMount } = props;
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('nome');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filter, setFilter] = useState({
        area: "",
        disciplinaID: "",
        numeracao: ""
    });
    
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

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
    const emptyRows = rowsPerPage - Math.min(
        rowsPerPage,
        data.length - page * rowsPerPage
    );

    // -- Tabela: Body
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar filter={filter} setFilter={setFilter} filterDialog={filterDialog} setFilterDialog={setFilterDialog}/>
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
                                stableSort(data, getComparator(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((conteudo, index) => {
                                        const {disciplinaID, numeracao} = conteudo;

                                        let auxArea = (disciplinaID.areaConhecimento === filter.area || filter.area === '') ? true : false;
                                        let auxSubject = (disciplinaID === filter.disciplinaID || filter.disciplinaID === '') ? true : false;
                                        let auxWeek = (numeracao === filter.numeracao || filter.numeracao === '') ? true : false;
                                        
                                        if (auxArea && auxSubject && auxWeek) {
                                            return (
                                                <TableRow hover={true} tabIndex={-1} key={conteudo._id}>
                                                    <TableCell className={classes.row} align="left">{conteudo.disciplinaID.areaConhecimento}</TableCell>

                                                    {!smScreen && <TableCell className={classes.row} align="left">{conteudo.disciplinaID.nome}</TableCell>}
                                                    {!smScreen && <TableCell className={classes.row} align="left">{conteudo.topico}</TableCell>}
                                                    {!smScreen && <TableCell className={classes.row} align="left">{conteudo.numeracao}</TableCell>}

                                                    <TableCell align="left">
                                                        <ContentVisualization 
                                                            ID={conteudo._id} 
                                                            nome={conteudo.topico} 
                                                            open={props.open} 
                                                            setOpen={props.setOpen}
                                                            setTitulo={props.setTitulo}
                                                            setId={props.setId}
                                                        />    
                                                        <UpdateContent id={conteudo._id}/>
                                                        <DeleteContent id={conteudo._id} nome={conteudo.topico} setMount={setMount}/>
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
