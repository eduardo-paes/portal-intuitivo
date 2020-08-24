import axios from "axios"

// Custom Upload Adapter
export class UploadAdapter {
  constructor(loader) {
    this.loader = loader
  }

  async upload() {
    return this.loader.file.then((file) => {
      const data = new FormData()
      data.append("file", file)
      const genericError = `Não foi possível fazer o upload do arquivo: ${file.name}.`

      return axios({
        data,
        method: "POST",
        url: "http://localhost:5000/api/uploader",
        headers: { "Content-Type": "multipart/form-data", },
        onUploadProgress: (progressEvent) => {
          this.loader.uploadTotal = progressEvent.total
          this.loader.uploaded = progressEvent.loaded
        },
      })
        .then(({ data }) => ({ default: data.url }))
        .catch(error => Promise.reject(error?.message ?? genericError))
    })
  }

  abort() {
    return Promise.reject()
  }
}
 
// CKEditor FileRepository
export function uploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
        new UploadAdapter(loader)
}