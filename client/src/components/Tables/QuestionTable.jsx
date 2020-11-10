import React, {useState, useEffect} from "react";
import {Link as RouterLink} from 'react-router-dom';
import api from '../../api'

import { QuestionDialogFilter } from "../"

// -- Material UI - Table
import clsx from 'clsx';
import { lighten, makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
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

// Botão de Atualização
function UpdateQuestion(props) {
    return (
        <RouterLink to={"/controle-questoes/update/" + props.id}>
            <IconButton aria-label="update" color="primary" size="small">
                <EditIcon/>
            </IconButton>
        </RouterLink>
    )
}

// Botão de Atualização
function ShowQuestion(props) {
    const { setQuestion, setHidden, question } = props;
    const choosingQuestion = () => {
        setQuestion(question);
        setHidden(true);
    }
    return (
        <IconButton aria-label="update" color="primary" size="small" onClick={() => choosingQuestion()}>
            <VisibilityIcon/>
        </IconButton>
    )
}

// Botão de Remoção
function DeleteQuestion(props) {
    function removing() {
        if (window.confirm(`Tem certeza que quer remover esta questão permanentemente?`)) {
            api.removerQuestao(props.id)
            props.setMount(preValue => ({...preValue, wasChanged: true}));
        }
    }

    return (
        <RouterLink to={"/controle-questoes"}>
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

    if (orderBy === 'topicoID.topico') {
        if (b.topicoID.topico < a.topicoID.topico) {
            return -1;
        }
        if (b.topicoID.topico > a.topicoID.topico) {
            return 1;
        }
        return 0;
    } 
    
    else if (orderBy === 'disciplinaID.nome') {
        if (b.disciplinaID.nome < a.disciplinaID.nome) {
            return -1;
        }
        if (b.disciplinaID.nome > a.disciplinaID.nome) {
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
const headCells = [
    {
        id: 'disciplinaID.nome',
        label: 'Disciplina'
    }, {
        id: 'topicoID.topico',
        label: 'Topico'
    }, {
        id: 'tipoResposta',
        label: 'Tipo'
    }, {
        id: 'tags',
        label: 'Tags'
    }, {
        id: 'funcoes',
        label: ''
    }
];

const phoneHeadCells = [
    {
        id: 'topicoID.topico',
        label: 'Topico'
    }, {
        id: 'funcoes',
        label: ''
    }
]

// -- Table: Head
function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, width, tableSelection } = props;

    var cells = !width ? headCells : phoneHeadCells;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {
                    tableSelection && 
                        <TableCell padding="checkbox">
                            <Checkbox
                                indeterminate={numSelected > 0 && numSelected < rowCount}
                                checked={rowCount > 0 && numSelected === rowCount}
                                onChange={onSelectAllClick}
                                inputProps={{ 'aria-label': 'select all desserts' }}
                            />
                        </TableCell>
                }
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
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
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
    const { filter, setFilter, filterDialog, setFilterDialog, isCleaned, setIsCleaned, activity } = props;
    const classes = useToolbarStyles();

    // -- Limpa o filtro
    function clearFilter() {
        setFilter({ 
            disciplinaID: "",
            topicoID: "",
            tipo: "",
            tags: "",
        });
        setIsCleaned(true);
    }

    return (
    <Toolbar className={clsx(classes.root)}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Lista de Questões
        </Typography>

        <div hidden={isCleaned} >
            <Tooltip title="Limpar filtro">
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

        <QuestionDialogFilter 
            activity={activity}
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

export default function QuestionTable(props) {
    const {data, setData, setQuestion, setHidden, tableSelection, filterDialog, setFilterDialog, filter, setFilter, selectedQuestions, setMount, activity} = props;

    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('nome');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [isCleaned, setIsCleaned] = useState(true);

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

    // -- Funções de Seleção - Questões
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
        const newSelecteds = data.map((n) => n._id);
        setSelected(newSelecteds);
        return;
        }
        setSelected([]);
    };
    
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
    
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
    
        setSelected(newSelected);
    };

    // -- Funções de Seleção - Tags
    const handleTags = (tags, filter) => {
        // Variável auxiliar do filtro
        let aux = {
            tags: [],
            flag: filter === '' ? true : false
        }

        // Ajustes para mostrar tags na tabela
        aux.tags = tags.map((tag, index) => {
            // Já realiza aqui o filtro
            if (tag.tagID.nome === filter) {
                aux.flag = true;
            }

            if (index+1 === tags.length) {
                return tag.tagID.nome;
            }
            return tag.tagID.nome + ", ";
        })

        //Retorna objeto preenchido
        return aux;
    }

    // -- Vigilantes
    useEffect(() => {
        const abortController = new AbortController();
        tableSelection && setData(preValue => ({
            ...preValue,
            questoes: selected
        }))
        return abortController.abort();
        // eslint-disable-next-line
    }, [selected])

    useEffect(() => {
        const abortController = new AbortController();
        if (tableSelection) setSelected(selectedQuestions);
        return abortController.abort();
        // eslint-disable-next-line
    }, [data])

    // -- Rows vazias para complementação
    const emptyRows = rowsPerPage - Math.min( rowsPerPage, data.length - page * rowsPerPage );

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // -- Tabela: Body
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <EnhancedTableToolbar 
                    activity={activity}
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
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                            tableSelection={tableSelection}
                            width={smScreen}/>
                        <TableBody>
                            {
                                stableSort(data, getComparator(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row, index) => {
                                        const { disciplinaID, topicoID, tipoResposta, tags} = row;
                                        const resposta = tipoResposta === "discursiva" ? "Discursiva" : "Múltipla escolha";
                                        
                                        const isItemSelected = isSelected(row._id);
                                        const labelId = `enhanced-table-checkbox-${row._id}`;
                                        
                                        let tagNames = handleTags(tags, filter.tags);
                                        let auxTags = tagNames.flag ? true : false;
                                        
                                        let auxType = (tipoResposta === filter.tipo || filter.tipo === '') ? true : false;
                                        let auxTopic = (topicoID._id === filter.topicoID || filter.topicoID === '') ? true : false;
                                        
                                        if (auxTags && auxType && auxTopic) {
                                            return (
                                                <TableRow
                                                    hover={true}
                                                    onClick={event => { tableSelection && handleClick(event, row._id) }}
                                                    role="checkbox"
                                                    aria-checked={tableSelection && isItemSelected}
                                                    tabIndex={-1}
                                                    key={row._id}
                                                    selected={tableSelection && isItemSelected}
                                                >

                                                    {
                                                        tableSelection && 
                                                            <TableCell padding="checkbox">
                                                                <Checkbox
                                                                    checked={isItemSelected}
                                                                    inputProps={{ 'aria-labelledby': labelId }}
                                                                />
                                                            </TableCell>
                                                    }

                                                    {!smScreen && <TableCell className={classes.row} align="left">{disciplinaID.nome}</TableCell>}
                                                    <TableCell className={classes.row} align="left">{topicoID.topico}</TableCell>
                                                    {!smScreen && <TableCell className={classes.row} align="left">{resposta}</TableCell>}
                                                    {!smScreen && <TableCell className={classes.row} align="left">{tagNames.tags}</TableCell>}

                                                    <TableCell align={smScreen ? "right" : "left"}>
                                                        <ShowQuestion id={row._id} question={row} setQuestion={setQuestion} setHidden={setHidden}/>
                                                        {!tableSelection && <UpdateQuestion id={row._id}/>}
                                                        {!tableSelection && <DeleteQuestion id={row._id} setMount={setMount}/>}
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
