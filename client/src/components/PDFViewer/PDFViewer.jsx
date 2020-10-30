import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {cyan} from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
    pdfBox: {
        width: '100%',
        height: '480px',
        borderColor: cyan[500]
    }
}));

function PDFViewer (props) {
    const classe = useStyles();
    const { source } = props;
    
    return (
        <iframe 
            src={source}  
            className={classe.pdfBox} 
            title="Conteúdo PDF."
        />
    );
}

export default PDFViewer;