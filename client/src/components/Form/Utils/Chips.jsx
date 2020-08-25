import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Chip } from "@material-ui/core";
import SplitButton from './SplitButton'

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
}));

export default function ChipsArray(props) {
    const classes = useStyles();

    const [arrayTag, setArrayTag] = useState([
        { key: 0, label: 'Angular', selected: false },
        { key: 1, label: 'jQuery', selected: false },
        { key: 2, label: 'Polymer', selected: false },
        { key: 3, label: 'React', selected: false },
        { key: 4, label: 'Vue.js', selected: false },
    ]);

    const [chipData, setChipData] = useState([]);

    const addingTag = (value) => {
        setChipData([
            ...chipData, 
            value
        ]);
    }

    const handleDelete = (chipToDelete) => () => {
        setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
    };

return (
    <Grid container={true}>
        <Grid item={true} xs={12} sm={9}>
            {chipData.map(tag => {
                return (
                    <Chip
                        key={tag.key}
                        label={tag.label}
                        onDelete={handleDelete(tag)}
                        className={classes.chip}
                    />
                );
            })}
        </Grid>

        <Grid item={true} xs={12} sm={3}>
            <SplitButton
                data={arrayTag}
                setData={setArrayTag}
                setTag={addingTag}
                selectedTags={chipData}
            />
        </Grid>
    </Grid>
);
}