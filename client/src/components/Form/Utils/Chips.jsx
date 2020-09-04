import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Chip } from "@material-ui/core";
import SplitButton from './SplitButton'
import api from '../../../api'


// -- Styles
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        listStyle: 'none',
        padding: theme.spacing(0.5),
        margin: 0,
    },
    chip: {
        margin: theme.spacing(0.5),
    },
    emptyTagMessage: {
        color: '#606161',
    }
}));

export default function ChipsArray(props) {
    const {disciplinaID} = props;
    const classes = useStyles();
    const emptyTagMessage = "Selecione as tags desejadas no botão ao lado."     // Mensagem para quando não há tags selecionadas
    const [selectedTag, setSelectedTag] = useState([]);                         // Lista de tags selecionadas
    const [tagList, setTagList] = useState([                                    // Lista de tags disponíveis
        { key: 0, nome: 'Tags', selected: true }
    ]);

    useEffect(() => {
        const abortController = new AbortController();

        if (disciplinaID) {
            console.log(disciplinaID)
            async function fetchTagAPI() {
                const response = await api.listarTagsPorDisciplina(disciplinaID);
                const value = response.data.data;
                console.log(value)
                setTagList(value.map((item, index) => {
                    return { ...item, key: index, selected: false }
                }));
            }
            fetchTagAPI()
        }

        return abortController.abort();
    }, [disciplinaID])

    useEffect(() => {
        console.log(selectedTag)
    }, [selectedTag])

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
        if (selectedTag[0] === emptyTagMessage) {
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

    return (
        <Grid container={true}>
            <Grid item={true} xs={12} sm={9}>
                {selectedTag.length === 0
                ? <p className={classes.emptyTagMessage}>{emptyTagMessage}</p>
                : selectedTag.map((tag, index) => {
                    return (
                        <Chip
                            key={tag.key}
                            label={tag.nome}
                            onDelete={handleDelete(tag)}
                            className={classes.chip}
                        />
                    );
                })}
            </Grid>

            <Grid item={true} xs={12} sm={3}>
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