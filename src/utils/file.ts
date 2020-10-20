
export const download = (res: any, fileName: string) => {
    let blob = new Blob([res]);
    if ('download' in document.createElement('a')) {
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } else {
        window.navigator.msSaveBlob(blob, fileName)
    }
}
