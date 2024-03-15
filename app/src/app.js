import { getCurrentWindow } from 'socket:application'
import FileList from './components/filesystem.js'
import fs from 'socket:fs/promises'
import path from 'socket:path'
import process from 'socket:process'

console.log(process.cwd())

async function checkAndReadFile(filePath) {
    try {
        await fs.access(filePath);
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    } catch (err) {
        return null;
    }
}

function deepFreeze(object) {
    // Retrieve the property names defined on object
    let propNames = Object.getOwnPropertyNames(object);

    // Freeze properties before freezing self
    propNames.forEach(name => {
        let prop = object[name];

        // Freeze prop if it is an object
        if (typeof prop === 'object' && prop !== null) {
            deepFreeze(prop);
        }
    });

    // Freeze self (no-op if already frozen)
    return Object.freeze(object);
}

function parseJSONString(data) {
    let value = JSON.parse(data);
    return deepFreeze(value);
}

async function init () {
    const cw = await getCurrentWindow()
    let lastfile = localStorage.lasfile
    if (!lastfile) {    
        const pick = await cw.showOpenFilePicker()
        localStorage.lastfile = pick[0]
        lastfile = pick[0]
    }
    try {
        const stats = await fs.stat(lastfile);

        if (stats.isDirectory()) {
            const elem = document.createElement('file-list');
            elem.join = path.join;
            elem.readFrom = async (f) => {
                elem.cwd = f;
                elem.files = await fs.readdir(f, { withFileTypes: true });
            }
            elem.openFile = async (f) => {
                const content = await checkAndReadFile(f);
                if (content) {
                    console.log(`Opening file ${f}`);
                }
            }
            await elem.readFrom(lastfile);
            document.body.appendChild(elem);
        } else if (stats.isFile()) {
            console.log(`${lastfile} is a file`);
        }
    } catch (err) {
        console.error(err);
    }
}

customElements.define('file-list', FileList);

const settings = init()
// console.log(settings)

export default init