import React, {useState, useEffect} from "react";
import {Link as RouterLink} from 'react-router-dom';

import { CorrectionDialogFilter } from ".."

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

// Botão de Atualização
function CorrigirRespostas(props) {
    const { essay, atividadeID } = props;
    const url = essay ? "/controle-correcoes/redacao/" : "/controle-correcoes/atividades/";

    return (
        <RouterLink to={url + atividadeID}>
            <IconButton aria-label="corrigir" color="primary" size="small">
                <EditIcon/>
            </IconButton>
        </RouterLink>
    )
}

// -- Funções auxiliares para Ordenação
function descendingComparator(a, b, orderBy) {
    if (orderBy === 'topico') {
        if (b.atividadeID.topicoID.topico < a.atividadeID.topicoID.topico) {
            return -1;
        }
        if (b.atividadeID.topicoID.topico > a.atividadeID.topicoID.topico) {
            return 1;
        }
        return 0;
    } 
    
    else if (orderBy === 'disciplina') {
        if (b.atividadeID.topicoID.disciplinaID.nome < a.atividadeID.topicoID.disciplinaID.nome) {
            return -1;
        }
        if (b.atividadeID.topicoID.disciplinaID.nome > a.atividadeID.topicoID.disciplinaID.nome) {
            return 1;
        }
        return 0;
    }

    else if (orderBy === 'numeracao') {
        if (b.atividadeID.topicoID.numeracao < a.atividadeID.topicoID.numeracao) {
            return -1;
        }
        if (b.atividadeID.topicoID.numeracao > a.atividadeID.topicoID.numeracao) {
            return 1;
        }
        return 0;
    }

    else if (orderBy === 'tipoAtividade') {
        if (b.atividadeID.tipoAtividade < a.atividadeID.tipoAtividade) {
            return -1;
        }
        if (b.atividadeID.tipoAtividade > a.atividadeID.tipoAtividade) {
            return 1;
        }
        return 0;
    }
    
    else {
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
const headActivityCells = [
    {
        id: 'numeracao',
        label: 'Numeração'
    }, {
        id: 'tipoAtividade',
        label: 'Tipo'
    }, {
        id: 'disciplina',
        label: 'Disciplina'
    }, {
        id: 'topico',
        label: 'Tópico'
    }, {
        id: 'funcoes',
        label: ''
    }
];

const headEssayCells = [
    {
        id: 'numeracao',
        label: 'Numeração'
    }, {
        id: 'disciplinaID.nome',
        label: 'Disciplina'
    }, {
        id: 'topicoID.topico',
        label: 'Tópico'
    }, {
        id: 'funcoes',
        label: ''
    }
];

const phoneHeadActivityCells = [
    {
        id: 'tipoAtividade',
        label: 'Tipo'
    }, {
        id: 'disciplinaID.nome',
        label: 'Disciplina'
    }, {
        id: 'funcoes',
        label: ''
    }
]

const phoneHeadEssayCells = [
    {
        id: 'numeracao',
        label: 'Numeração'
    }, {
        id: 'disciplinaID.nome',
        label: 'Disciplina'
    }, {
        id: 'funcoes',
        label: ''
    }
]

// -- Table: Head
function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort, width, essay} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    const [cells, setCells] = useState([]);

    // Altera o cabeçalho da tabela, conforme tipo de listage: Revisão ou Atividades
    useEffect(() => {
        if (width) {
            (essay) ? setCells(phoneHeadEssayCells) : setCells(phoneHeadActivityCells);
        } else {
            (essay) ? setCells(headEssayCells) : setCells(headActivityCells);
        }
    }, [essay, width])

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
    const { filter, setFilter, filterDialog, setFilterDialog, essay, cleanFilter } = props;
    const classes = useToolbarStyles();

    return (
    <Toolbar className={clsx(classes.root)}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            {essay ? "Lista de Redações" : "Lista de Atividades"}
        </Typography>

        <Tooltip title="Limpar filtro">
            <IconButton aria-label="filter list" color="secondary" onClick={() => setFilter(cleanFilter)}>
                <ClearAllIcon />
            </IconButton>
        </Tooltip>

        <Tooltip title="Filtrar lista">
            <IconButton aria-label="filter list" onClick={() => setFilterDialog(true)}>
                <FilterListIcon />
            </IconButton>
        </Tooltip>

        {/* <CorrectionDialogFilter 
            filter={filter}
            setFilter={setFilter}
            open={filterDialog}
            setOpen={setFilterDialog}
            essay={essay}
        /> */}
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

export default function CorrectionTable(props) {
    const {data, filterDialog, setFilterDialog, essay} = props;
    
    const classes = useStyles();
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('topicoID.topico');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const cleanFilter = {
        numeracao: '',
        tipo: '',
        disciplina: '',
        topico: '',
        aluno: ''
    }
    const [filter, setFilter] = useState(cleanFilter);

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
                    filterDialog={filterDialog} 
                    setFilterDialog={setFilterDialog}
                    cleanFilter={cleanFilter}
                    essay={essay}/>
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
                            essay={essay}
                            width={smScreen}/>
                        <TableBody>
                            {                                
                                (data.length > 0) && stableSort(data, getComparator(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map(row => {

                                        const task = essay ? row.redacaoID : row.atividadeID;
                                        const { tipoAtividade, topicoID } = task;
                                        const { numeracao, topico, disciplinaID } = topicoID;

                                        // let auxStudent = (alunoID.nome.includes(filter.aluno) || filter.aluno === '') ? true : false;
                                        let auxType = (tipoAtividade === filter.tipo || filter.tipo === '' || essay) ? true : false;
                                        let auxSubject = (disciplinaID._id === filter.disciplina || filter.disciplina === '') ? true : false;
                                        let auxTopic = (topicoID._id === filter.topico || filter.topico === '') ? true : false;
                                        let auxWeek = (numeracao === filter.numeracao || filter.numeracao === '') ? true : false;

                                        if (auxType && auxSubject && auxTopic && auxWeek) {
                                            return (
                                                <TableRow hover={true} tabIndex={-1} key={row._id}>
                                                    
                                                    <TableCell className={classes.row} align="left">{numeracao}</TableCell>
                                                    {!essay && <TableCell className={classes.row} align="left">{tipoAtividade}</TableCell>}
                                                    <TableCell className={classes.row} align="left">{disciplinaID.nome}</TableCell>
                                                    {!smScreen && <TableCell className={classes.row} align="left">{topico}</TableCell>}

                                                    <TableCell align={smScreen ? "right" : "left"}>
                                                        <CorrigirRespostas essay={essay} atividadeID={row._id}/>
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