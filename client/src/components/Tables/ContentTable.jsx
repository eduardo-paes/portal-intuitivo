import React, {Component} from "react";
import {Link as RouterLink} from 'react-router-dom';
import api from '../../api'

// -- Material UI - Table
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

// -- Material UI - Icons
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';

// Função para retornar as dimensões da tela
import WindowDimension from "../WindowDimension";

// Função para abrir popup com o pdf do conteúdo
import Popup from 'reactjs-popup';
import PDFViewer from "../PDFViewer/PDFViewer";

// Botão para visualização do conteúdo
function ContentVisualization (props) {

    return (
        <Popup
            trigger={
                <IconButton 
                    aria-label="visualization" 
                    color="primary" 
                    size="small"> 
                    <VisibilityIcon/> 
                </IconButton>
            }
            modal
            closeOnDocumentClick
        >
            <PDFViewer source={`http://localhost:5000/uploads/content/${props.id}.pdf`}/>
        </Popup>
            
    )
}

// Botão de Atualização
class UpdateContent extends Component {
    // Retorna o botão
    render() {
        return (
            <RouterLink to={"/controle-conteudo/update/" + this.props.id}>
                <IconButton aria-label="update" color="primary" size="small">
                    <EditIcon/>
                </IconButton>
            </RouterLink>
        )
    }
}

// Botão de Remoção
function DeleteContent(props) {
    function removing() {
        if (window.confirm(`Quer remover o conteúdo ${props.nome} permanentemente?`)) {
            api.removerConteudo(props.id)
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
        id: 'area',
        label: 'Área'
    }, {
        id: 'disciplina',
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
        id: 'topico',
        label: 'Tópico'
    }
]

// -- Table: Head
function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort, width} = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    
    var cells = [];

    if (width > 500) {
        cells = headCells;
    } else {
        cells = phoneHeadCells
    }

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
        minWidth: 300,
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
    const conteudos = props.data;
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('nome');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const wd = WindowDimension();

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
        conteudos.length - page * rowsPerPage
    );

    // -- Tabela: Body
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
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
                            width={wd.width}/>
                        <TableBody>
                            {
                                stableSort(conteudos, getComparator(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((conteudo, index) => {

                                        return (
                                            <TableRow hover={true} tabIndex={-1} key={conteudo._id}>
                                                <TableCell className={classes.row} align="left">{conteudo.area}</TableCell>

                                                {(wd.width > 500) && <TableCell className={classes.row} align="left">{conteudo.disciplina}</TableCell>}
                                                {(wd.width > 500) && <TableCell className={classes.row} align="left">{conteudo.topico}</TableCell>}
                                                {(wd.width > 500) && <TableCell className={classes.row} align="left">{conteudo.numeracao}</TableCell>}

                                                <TableCell align="left">
                                                    <ContentVisualization id={conteudo._id}/>
                                                    <UpdateContent id={conteudo._id}/>
                                                    <DeleteContent id={conteudo._id} nome={conteudo.disciplina}/>
                                                </TableCell>
                                            </TableRow>
                                        );
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
                    count={conteudos.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}/>
            </Paper>
        </div>
    );
}
