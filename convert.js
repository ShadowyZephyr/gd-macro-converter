//this code was cobbled together very quickly
function downloadjson(object, filename) {
	const json = JSON.stringify(object, null, 2);
	const blob = new Blob([json],{ type:'application/json' });
	const href = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = href
	link.download = filename
	link.click()
}
function downloadtxt(txt) {
    const link = document.createElement('a');
    link.href = 'data:attachment/text,' + encodeURI(txt);
    link.target = '_blank';
    link.download = 'myFile.txt';
    link.click();
}
function dothething() {
    let filetype;
    const input = document.createElement('input');
    const reader = new FileReader();
    input.type = 'file';
    input.click();
    input.onchange = e => {
        const file = e.target.files[0];
        const nameCheck = file.name.split('.')
        console.log(nameCheck);
        if (nameCheck[nameCheck.length-1] == 'json' && nameCheck[nameCheck.length-2] == 'gdr') {
            filetype = 'gdr.json'
        } else if (nameCheck[nameCheck.length-1] == 'txt') {
            filetype = 'txt'
        } else {
            document.getElementById('errormessage').innerHTML = 'Invalid file type: files must be ybot .txt or .gdr.json'
            return;
        }
        reader.readAsText(file);
    }
    input.remove();
    reader.onload = e => {
        filename = document.getElementById("file").value;
        if(filetype == 'txt') {
            downloadjson(convertYbot(reader.result),filename + '.gdr.json'); 
        } else if (filetype == 'gdr.json') {
            downloadtxt(convertGdr(reader.result),filename + '.ybot');
        }
    }   
}

function convbtn(x) {
    if (x == "R") {
        return 3;
    } else if (x == "L") {
        return 2;
    } else {
        return 1;
    }
}
function convbtn2(x) {
    if(x == 3) {
        return "R";
    } else if (x == 2) {
        return "L";
    } else if (x == 1) {
        return '';
    }
}
function bool2str(bool) {
    let result = bool | 0;
    result = bool & 1; 
    return result.toString();
}
function convertYbot(ybot) {
    const mhr = {
        "author": "",
        "bot": {
          "name": "yBot",
          "version": "2.1.29-stable"
        },
        "coins": 0,
        "description": "",
        "duration": 241,
        "gameVersion": 2.2039999961853027,
        "inputs": [],
        "ldm": false,
        "level": {
          "id": 0,
          "name": ''
        },
        "seed": 0,
        "version": 0
    }
    const f = ybot.split(/\r?\n/);
    mhr.duration = Number(f[f.length-2].split(" ")[0]);
    for (let i = 1; i < f.length; i++) {
        const l = f[i].split(" ");
        const obj = {
            "2p": !Boolean(Number(l[2])),
            "btn": convbtn(l[3]),
            "down": Boolean(Number(l[1])),
            "frame": Number(l[0])+1
        }
        mhr.inputs.push(obj);
    }
    return mhr;
}
function convertGdr(gdr) {
    const obj = JSON.parse(gdr);
    let ybot = '240'
    const inputs = obj.inputs;
    for(let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        let line = '\n' + (input.frame-1).toString() + ' ' + bool2str(input.down) + ' ' + bool2str(input['2p']) + ' ' + convbtn2(input.btn);
        ybot = ybot + line;
    }
    return ybot;
}