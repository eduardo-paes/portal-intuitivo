const { makeStyles } = require("@material-ui/core");

export const useStyles = makeStyles((theme) => ({
  accordionContainer: {
    textAlign: "center",
  },
  areaName: {
    fontSize: '0.9rem',
    textAlign: "center",
    marginTop: "0.1rem"
  },
  avgGrade: {
    fontSize: '1.5rem',
    [theme.breakpoints.down('md')]: {
        fontSize: "1.3rem",
    }
  },
  avgGradeGrid: {
    textAlign: "center",
  },
  avgLabel: {
    fontSize: '0.7rem',
  },
  container: {
    margin: "0.7rem 0",
  },
  divider: {
    color: "#606161",
    margin: "0.7rem 0",
    textAlign: "center"
  },
  gradeText: {
    fontSize: '0.8rem',
  },
  gridTitle: {
    fontSize: '1.3rem',
    marginBottom: "1rem",
    [theme.breakpoints.down('sm')]: {
        marginTop: "1rem",
    },
    [theme.breakpoints.down('md')]: {
        fontSize: "1.1rem",
    }
  },
  gridSubtitle: {
    fontSize: '0.9rem',
    textAlign: "left",
    marginTop: "0.1rem",
    [theme.breakpoints.down('md')]: {
        fontSize: "0.8rem",
    }
  },
  helper: {
    [theme.breakpoints.down('sm')]: {
        borderLeft: `1px solid ${theme.palette.divider}`,
    },
    padding: "0 0.5rem"
  },
  itemGridRank: {
    display: 'flex',
    alignItems: 'center',
  },
  leftTitle: {
    fontSize: '1.3rem',
    textAlign: "left",
    [theme.breakpoints.down('md')]: {
        fontSize: "1.1rem",
    }
  },
  rankContainer: {
    "&:hover": {
        background: "#eeeeee"
    },
    padding: "0 0.5rem",
  },
  resultGrade: {
    fontSize: '2rem', 
    padding: "1.4rem 0 1.4rem 1rem",
    [theme.breakpoints.down('md')]: {
        fontSize: '1.5rem', 
        padding: "1rem 0 1rem 1rem",
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '2rem', 
        padding: "1.4rem 0 1rem 1rem",
    }
  },
  resultFrequency: {
    padding: '0 2rem', 
    [theme.breakpoints.down('md')]: {
        padding: "0 1rem",
    },
  },
  rightTitle: {
    fontSize: '1.2rem',
    fontWeight: '500'
  },
  subjectResults: {
    paddingLeft: "1.2rem",
    [theme.breakpoints.down('sm')]: {
        marginTop: "0",
    }
  },
  topDivider: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}));
