import React from 'react';

// -- Quill Editor
import ReactQuill, { Quill } from 'react-quill';
import "react-quill/dist/quill.snow.css";

import axios from 'axios';
const postURL = "http://localhost:3000/api/upload-arquivo"
const __ISMSIE__ = navigator.userAgent.match(/Trident/i) ? true : false;

// -- Configuração do ClipBoard
const QuillClipboard = Quill.import('modules/clipboard');
class Clipboard extends QuillClipboard {

    getMetaTagElements = (stringContent) => {
        const el = document.createElement('div');
        el.innerHTML = stringContent;
        return el.getElementsByTagName('meta');
    };

    async onPaste(e) {
        let clipboardData = e.clipboardData || window.clipboardData;
        let pastedData = await clipboardData.getData('Text');

        const urlMatches = pastedData.match(/\b(http|https)?:\/\/\S+/gi) || [];
        if (urlMatches.length > 0) {
            e.preventDefault();
            urlMatches.forEach(link => {
                axios.get(link)
                    .then(payload => {
                        let title, image, url;
                        for (let node of this.getMetaTagElements(payload)) {
                            if (node.getAttribute("property") === "og:title") {
                                title = node.getAttribute("content");
                            }
                            if (node.getAttribute("property") === "og:image") {
                                image = node.getAttribute("content");
                            }
                            if (node.getAttribute("property") === "og:url") {
                                url = node.getAttribute("content");
                            }
                        }

                        const rendered = `<a href=${url} target="_blank"><div><img src=${image} alt=${title} width="20%"/><span>${title}</span></div></a>`;

                        let range = this.quill.getSelection();
                        let position = range ? range.index : 0;
                        this.quill.pasteHTML(position, rendered, 'silent');
                        this.quill.setSelection(position + rendered.length);
                    })
                    .catch(error => console.error("ClipBoard", error));
            });

        } else {
            super.onPaste(e);
        }
    }

}
Quill.register('modules/clipboard', Clipboard, true);

// -- Para adição de Imagem
const BlockEmbed = Quill.import('blots/block/embed');
class ImageBlot extends BlockEmbed {
    static create(value) {
        const imgTag = super.create();
        imgTag.setAttribute('src', value.src);
        imgTag.setAttribute('alt', value.alt);
        imgTag.setAttribute('width', '100%'); // Comentar depois
        return imgTag;
    }

    static value(node) {
        return { 
            src: node.getAttribute('src'), 
            alt: node.getAttribute('alt') 
        };
    }
}
ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';
Quill.register(ImageBlot);

// -- Para adição de Vídeo
class VideoBlot extends BlockEmbed {
    static create(value) {
        if (value && value.src) {
            const videoTag = super.create();
            videoTag.setAttribute('src', value.src);
            videoTag.setAttribute('title', value.title);
            videoTag.setAttribute('width', '100%');
            videoTag.setAttribute('controls', '');
            return videoTag;
        } else {
            const iframeTag = document.createElement('iframe');
            iframeTag.setAttribute('src', value);
            iframeTag.setAttribute('frameborder', '0');
            iframeTag.setAttribute('allowfullscreen', true);
            iframeTag.setAttribute('width', '100%');
            return iframeTag;
        }
    }

    static value(node) {
        if (node.getAttribute('title')) {
            return { src: node.getAttribute('src'), alt: node.getAttribute('title') };
        } else {
            return node.getAttribute('src');
        }
    }
}
VideoBlot.blotName = 'video';
VideoBlot.tagName = 'video';
Quill.register(VideoBlot);

// -- Para adição de Arquivos
class FileBlot extends BlockEmbed {
    static create(value) {
        const prefixTag = document.createElement('span');
        prefixTag.innerText = "첨부파일 - ";

        const bTag = document.createElement('b');
        bTag.innerText = value;

        const linkTag = document.createElement('a');
        linkTag.setAttribute('href', value);
        linkTag.setAttribute("target", "_blank");
        linkTag.setAttribute("className", "file-link-inner-post");
        linkTag.appendChild(bTag);

        const node = super.create();
        node.appendChild(prefixTag);
        node.appendChild(linkTag);

        return node;
    }
    static value(node) {
        const linkTag = node.querySelector('a');
        return linkTag.getAttribute('href');
    }
}
FileBlot.blotName = 'file';
FileBlot.tagName = 'p';
FileBlot.className = 'file-inner-post';
Quill.register(FileBlot);

// -- Configuração de PollBlot
class PollBlot extends BlockEmbed {

    static create(value) {
        const prefixTag = document.createElement('span');
        prefixTag.innerText = "투표 - ";

        const bTag = document.createElement('b');
        bTag.innerText = value.title;

        const node = super.create();
        node.setAttribute('id', value.id);
        node.appendChild(prefixTag);
        node.appendChild(bTag);

        return node;
    }

    static value(node) {
        const id = node.getAttribute('id');
        const bTag = node.querySelector('b');
        const title = bTag.innerText;
        return { id, title };
    }
}
PollBlot.blotName = 'poll';
PollBlot.tagName = 'p';
PollBlot.className = 'poll-inner-post';
Quill.register(PollBlot);

// -- Definição do QuillEditor
class QuillEditor extends React.Component {
    bandId;
    placeholder;
    onEditorChange;
    onFilesChange;
    onPollsChange;
    _isMounted;

    constructor(props) {
        super(props);

        this.state = {
            editorHtml: __ISMSIE__ ? "<p>&nbsp;</p>" : "",
            files: [],
        };

        this.reactQuillRef = null;

        this.inputOpenImageRef = React.createRef();
        this.inputOpenVideoRef = React.createRef();
        this.inputOpenFileRef = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleChange = (html) => {
        console.log('html', html)

        this.setState({
            editorHtml: html
        }, () => {
            this.props.onEditorChange(this.state.editorHtml);
        });
    };

    imageHandler = () => {
        this.inputOpenImageRef.current.click();
    };

    videoHandler = () => {
        this.inputOpenVideoRef.current.click();
    };

    fileHandler = () => {
        this.inputOpenFileRef.current.click();
    };

    // -- Função de Inserção de Vídeo
    insertImage = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.currentTarget && event.currentTarget.files && event.currentTarget.files.length > 0) {
            const file = event.currentTarget.files[0];
            
            let formData = new FormData();
            const config = {
                header: { 
                    'content-type': 'multipart/form-data' 
                }
            }
            formData.append("file", file);

            console.log(file);

            axios.post(postURL, formData, config)
                .then(response => {
                    if (response.data.success) {
                        const quill = this.reactQuillRef.getEditor();
                        quill.focus();

                        let range = quill.getSelection();
                        let position = range ? range.index : 0;

                        console.log(response.data.url)

                        quill.insertEmbed(position, "image", { 
                            src: "http://localhost:8000/" + response.data.url, 
                            alt: response.data.fileName 
                        });

                        quill.setSelection(position + 1);

                        if (this._isMounted) {
                            this.setState({
                                files: [...this.state.files, file]
                            }, () => { 
                                this.props.onFilesChange(this.state.files) 
                            });
                        }
                    } else {
                        return alert('Falha no upload da imagem.')
                    }
                })
        }
    };

    // -- Função de Inserção de Vídeo
    insertVideo = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.currentTarget && event.currentTarget.files && event.currentTarget.files.length > 0) {
            const file = event.currentTarget.files[0];

            let formData = new FormData();
            const config = { header: { 'content-type': 'multipart/form-data' } }
            formData.append("file", file);

            // -- Axios POST
            axios.post(postURL, formData, config)
                .then(response => {
                    if (response.data.success) {

                        const quill = this.reactQuillRef.getEditor();
                        quill.focus();

                        let range = quill.getSelection();
                        let position = range ? range.index : 0;

                        quill.insertEmbed(position, "video", { 
                            src: "http://localhost:8000/" + response.data.url, 
                            title: response.data.fileName 
                        });
                        quill.setSelection(position + 1);

                        if (this._isMounted) {
                            this.setState({
                                files: [...this.state.files, file]
                            }, () => { this.props.onFilesChange(this.state.files) });
                        }
                    } else {
                        console.log(response);
                        return alert('Falha no upload do vídeo.')
                    }
                })
        }
    }
    
    // -- Função de Inserção de Arquivo
    insertFile = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (event.currentTarget && event.currentTarget.files && event.currentTarget.files.length > 0) {
            const file = event.currentTarget.files[0];
            console.log("File:", file);

            let formData = new FormData();
            const config = {
                header: { 
                    'content-type': 
                    'multipart/form-data'
                }
            }

            formData.append("file", file);

            // -- Axios POST
            axios.post(postURL, formData, config)
                .then(response => {
                    if (response.data.success) {
                        const quill = this.reactQuillRef.getEditor();
                        quill.focus();

                        let range = quill.getSelection();
                        let position = range ? range.index : 0;

                        quill.insertEmbed(position, "file", response.data.fileName);
                        quill.setSelection(position + 1);

                        if (this._isMounted) {
                            this.setState({
                                files: [...this.state.files, file]
                            }, () => { this.props.onFilesChange(this.state.files) });
                        }
                    } else {
                        console.log("Problema na inserção do arquivo.")
                        console.log(response);
                    }
                })
        }
    };

    render() {
        return (
            <div>
                <ReactQuill
                    ref={(el) => { this.reactQuillRef = el }}
                    theme={'snow'}
                    onChange={this.handleChange}
                    modules={this.modules}
                    formats={this.formats}
                    value={this.state.editorHtml}
                    style={{background: "#fff"}}
                    placeholder={this.props.placeholder}
                />

                {/* -- Inputs acionados pelos handlers */}
                <input type="file" name="image" accept="image/*" ref={this.inputOpenImageRef} style={{ display: "none" }} onChange={this.insertImage} />
                <input type="file" name="video" accept="video/*" ref={this.inputOpenVideoRef} style={{ display: "none" }} onChange={this.insertVideo} />
                <input type="file" name="file" accept="*" ref={this.inputOpenFileRef} style={{ display: "none" }} onChange={this.insertFile} />
            </div>
        )
    }

    modules = {
        // syntax: true,
        toolbar: {
            container: [
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'font': [] }],
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                [{ 'align': [] }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image', 'video'],
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                ['clean']
            ],
            handlers: {
                'image': this.imageHandler,
                'video': this.videoHandler,
                'file': this.fileHandler,
                insertPoll: this.pollHandler,
            }
        },

    };

    formats = [
        'size', 'font', 'align',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'indent', 'script',
        'image', 'video', 'file', 'link', "code-block", "video", "blockquote", "clean"
    ];
}

export default QuillEditor;