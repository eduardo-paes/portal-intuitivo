import React from 'react';
// import Image from 'material-ui-image';

export default function MathDisplay(props) {
    const {text} = props;
    const script = document.createElement("script");
    script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
    script.async = true;
    document.body.appendChild(script);
    return (
        <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: text}} />
    );
}