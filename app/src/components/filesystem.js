class FileList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set files(files) {
        this._files = files;
        this.render();
        this.addEventListeners();
    }

    readFrom(directoryPath) {
        // Implement your readFrom function here
        console.log(`Reading from ${directoryPath}`);
    }

    openFile(filePath) {
        // Implement your openFile function here
        console.log(`Opening file ${filePath}`);
    }

    addEventListeners() {
        this.shadowRoot.querySelector('span[data-dir=".."]').addEventListener('click', () => {
            this.readFrom(this.join(this.cwd, '..'))
        });

        this._files.forEach(file => {
            console.log({file})
            console.log(this.cwd, file.name)
            const f = this.join(this.cwd, file.name)
            this.shadowRoot.querySelector(`span[data-dir="${file.name}"]`).addEventListener('click', () => {
                if (file.isDirectory) {
                    return this.readFrom(f);
                } else {
                    return this.openFile(f);
                }
            });
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    color: blue;
                    text-align: left;
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                li {
                    margin: 5px 0;
                }
                span {
                    color: inherit;
                    text-decoration: underline;
                    cursor: pointer;
                }
            </style>
            <ul>
                <li>
                    <span data-dir="..">🔼 ..</span>
                </li>
                ${this._files.map(file => `
                    <li>
                        <span data-dir="${file.name}">
                            ${file.type === 'directory' ? '📁' : '📄'} 
                            ${file.name}
                        </span>
                    </li>
                `).join('')}
            </ul>
        `;
    }
}

export default FileList;