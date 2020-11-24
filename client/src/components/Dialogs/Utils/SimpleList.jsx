import React from 'react';
import { makeStyles, Grid, Input } from '@material-ui/core';
import { GeneralText } from '../../../assets/styles/styledComponents';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    "&:hover": {
      background: "#eeeeee"
    },
    margin: '0.5rem 0 0.5rem 0',
    padding: "0.3rem 0.3rem 0 0.3rem",
    color: '#606161'
  },
  itemGrid: {
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold'
  }
}));

export default function SimpleList(props) {
  const classes = useStyles();
  const { array, value, setValue, word } = props;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValue(preValue => ({
      ...preValue,
      [name]: value < 0 ? 0 : Number(value)
    }));
  };

  return (
    <Grid container>
      {
        array.map((element, index) => {
          return (
            <Grid item key={index} xs={12}>
              <Grid container className={classes.root}>
                <Grid item xs={2} sm={1}>
                  <GeneralText className={classes.label}>{word}{index+1}</GeneralText>
                </Grid>

                <Grid item xs={8} sm={9}>
                  <GeneralText>{element.item}</GeneralText>
                </Grid>

                <Grid item xs={2} sm={2} className={classes.itemGrid} style={{justifyContent: "flex-end"}}>
                  <Input
                    value={value.[element.label]}
                    name={element.label}
                    onChange={handleInputChange}
                    style={{alignmentBaseline: 'center'}}
                    inputProps={{
                      step: 1,
                      min: 0,
                      max: 999,
                      type: 'number',
                      style: { textAlign: 'center' }
                    }}
                    />
                </Grid>
              </Grid>
            </Grid>
          )
        })
      }
    </Grid>
  );
}