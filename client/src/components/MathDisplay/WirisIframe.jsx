import React, { useEffect, useState } from 'react';

export default function MathDisplay(props) {
    const {text} = props;
    const [wasLoaded, setWasLoaded] = useState(false)

    useEffect(() => {
        const abortController = new AbortController();
        if (props && !wasLoaded) {
            const script = document.createElement("script");
            script.src = "https://www.wiris.net/demo/plugins/app/WIRISplugins.js?viewer=image";
            script.async = true;
            document.body.appendChild(script);
            setWasLoaded(true);
        }
        return abortController.abort();
        // eslint-disable-next-line
      }, [props]);
    
    return (
        <div id="mostrarEnunciadoQuestao" className='ck-content' dangerouslySetInnerHTML={{ __html: text}} />
    );
}