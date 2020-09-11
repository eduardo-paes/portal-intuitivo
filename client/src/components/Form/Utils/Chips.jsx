import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Grid, Chip } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SplitButton from './SplitButton'
import api from '../../../api'

// -- Styles
const useStyles = makeStyles((theme) => ({
    root: {
        marginBottom: "1rem",
        marginTop: "1rem"
    },
    tagGroup: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    buttomGroup: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: "1rem"
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    emptyTagMessage: {
        color: '#606161',
    },
}));

export default function ChipsArray(props) {
    const { disciplinaID, selectedTag, setSelectedTag, handleTag } = props;
    const classes = useStyles();
    const initialTag = [{key: 0, nome: 'Tags', selected: true}];                            // Valor inicial da lista de tags
    const emptyTagMessage = "Selecione as tags desejadas no botão ao lado."                 // Mensagem para quando não há tags selecionadas
    const [tagList, setTagList] = useState(initialTag);                                     // Lista de tags disponíveis
    const [count, setCount] = useState(1);
    const theme = useTheme();
    const smScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Carrega Tags por Disciplina
    useEffect(() => {
        const abortController = new AbortController();
        if (disciplinaID) {
            async function fetchTagAPI() {
                setSelectedTag([]);
                const response = await api.listarTagsPorDisciplina(disciplinaID);
                const value = response.data.data;
                setTagList(value.map((item, index) => {
                    return { ...item, key: index, selected: false }
                }));
                console.log(value);
            }
            fetchTagAPI()
        }
        return abortController.abort();
        // eslint-disable-next-line
    }, [disciplinaID])

    useEffect(() => {
        if (count) {
            if (selectedTag.length > 0 && tagList.length > 0) {
                let arrayAux = [];
                selectedTag.map(tag => {
                    return setTagList(chips => 
                    chips.map(chip => {
                        // console.log(tag, chip._id)
                            if (chip._id === tag) {
                                arrayAux.push(chip);
                                return {...chip, selected: true}
                            } else {
                                return chip;
                            }
                        })
                    );
                })
                setSelectedTag(arrayAux);
                setCount(count-1)
            }
        }
        // eslint-disable-next-line
    }, [tagList])

    // -- Confirma mudanças realizadas em Tag
    useEffect(() => {
        handleTag();
        // eslint-disable-next-line
    }, [selectedTag]);

    // Função callback após adicionar/remover uma tag
    const handleTagSelection = (index) => {
        setTagList(tagList.map(tag => {
            if (tag.key === index) {
                return {...tag, selected: !tag.selected };
            } else {
                return tag;
            }
        }))
    }

    // Função para adicionar uma nova tag à lista de seleção
    const handleAdd = (value) => {
        if (selectedTag.length === 0) {
            setSelectedTag([value]);
        } else {
            setSelectedTag([
                ...selectedTag, 
                value
            ]);
        }
        handleTagSelection(value.key);
    }

    // Função para remover uma nova tag da lista de seleção
    const handleDelete = (chipToDelete) => () => {
        setSelectedTag(chips => chips.filter(chip => chip.key !== chipToDelete.key));
        handleTagSelection(chipToDelete.key);
    };

    // Retorna as Tags em tela
    function returnTags () {
        if (selectedTag.length === 0) {
            return <p className={classes.emptyTagMessage}>{emptyTagMessage}</p>;
        } else {
            return selectedTag.map((tag, index) => {
                return (
                    tag.nome !== undefined &&
                        <Chip
                            key={index}
                            label={tag.nome}
                            onDelete={handleDelete(tag)}
                            className={classes.chip}
                        />
                );
            })
        }
    }

    return (
        <Grid container={true} className={classes.root}>
            {/* -- Tags -- */}
            <Grid item={true} xs={12} sm={9} className={smScreen ? classes.tagGroup : 'none'}>
                {returnTags()}
            </Grid>
            {/* -- Button -- */}
            <Grid item={true} xs={12} sm={3} className={smScreen ? classes.buttomGroup : 'none'}>
                <SplitButton
                    data={tagList}
                    setData={setTagList}
                    setTag={handleAdd}
                    selectedTags={selectedTag}
                />
            </Grid>
        </Grid>
    );
}