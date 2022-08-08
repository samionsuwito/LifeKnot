let timer;
let playing = false;
let framesperchange = 30;
// set inner height and width based on screen size
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;// global vars
let scene, camera, renderer, controls, mesh, projector, materials, wireframe;
let objects = [];
let turnOn = [];
let turnOff = [];
let p, q, torusrad, tuberad, tubular, radial, totalfaces;
let importval = "";
let exportval = "";

init();

update();

function setRandom() {
    for (let i = 0; i < totalfaces; i++) {
        if (Math.random() < 0.5) {
            mesh.geometry.faces[i].color.setRGB(0.110, 0.918, 0.259);
            mesh.geometry.faces[i].materialIndex = 1;
        } else {
            mesh.geometry.faces[i].color.setHex(0x000030);
            mesh.geometry.faces[i].materialIndex = 0;
        }
    }
    mesh.geometry.colorsNeedUpdate = true;
}

function setNew() {
    p = Number(document.getElementById("p").value);
    q = Number(document.getElementById("q").value);
    torusrad = Number(document.getElementById("torusrad").value);
    tuberad = Number(document.getElementById("tuberad").value);
    tubular = Number(document.getElementById("tubular").value);
    radial = Number(document.getElementById("radial").value);
    totalfaces = tubular * radial;
    setKnot();
}

function setKnot() {
    camera.position.set(0, 0, 2);
    scene.remove(mesh);
    scene.remove(wireframe);
    let geometry = new THREE.TorusKnotGeometry(torusrad, tuberad, tubular, radial, p, q);
    let material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
    mesh = new THREE.Mesh(geometry, material);
    for (let i = 0; i < totalfaces; i++) {
        mesh.geometry.faces[i].color.setHex(0x000030);
        mesh.geometry.faces[i].materialIndex = 0;
    }
    wireframe = new THREE.WireframeHelper(mesh);
    scene.add(wireframe);
    scene.add(mesh);
    objects = [];
    objects.push(mesh);
    console.log("switched to custom");
}

function setExample() {
    for (let i = 0; i < totalfaces; i += ((radial * 5) + 1)) {
        if (i % radial < radial - 2) {
            mesh.geometry.faces[i].color.setRGB(0.110, 0.918, 0.259);
            mesh.geometry.faces[i + 1].color.setRGB(0.110, 0.918, 0.259);
            mesh.geometry.faces[i + radial].color.setRGB(0.110, 0.918, 0.259);
            mesh.geometry.faces[i + radial + 2].color.setRGB(0.110, 0.918, 0.259);
            mesh.geometry.faces[i + (2 * radial)].color.setRGB(0.110, 0.918, 0.259);

            mesh.geometry.faces[i].materialIndex = 1;
            mesh.geometry.faces[i + 1].materialIndex = 1;
            mesh.geometry.faces[i + radial].materialIndex = 1;
            mesh.geometry.faces[i + radial + 2].materialIndex = 1;
            mesh.geometry.faces[i + (2 * radial)].materialIndex = 1;
        }
    }

    mesh.geometry.colorsNeedUpdate = true;
}

function setDefault() {
    p = 2;
    q = 3;
    radial = 32;
    tubular = 256;
    torusrad = 0.27;
    tuberad = 0.1;
    totalfaces = tubular * radial;
    camera.position.set(0, 0, 1.5);
    scene.remove(mesh);
    scene.remove(wireframe);
    let geometry = new THREE.TorusKnotGeometry(0.27, 0.1, 256, 32);
    let material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors });
    mesh = new THREE.Mesh(geometry, material);
    for (let i = 0; i < 8192; i++) {
        mesh.geometry.faces[i].color.setHex(0x000030);
        mesh.geometry.faces[i].materialIndex = 0;
    }
    wireframe = new THREE.WireframeHelper(mesh);
    scene.add(wireframe);
    scene.add(mesh);
    objects = [];
    objects.push(mesh);
    console.log("switched to 3,2");
    document.getElementById("p").value = String(p);
    document.getElementById("q").value = String(q);
    document.getElementById("torusrad").value = String(torusrad);
    document.getElementById("tuberad").value = String(tuberad);
    document.getElementById("tubular").value = String(tubular);
    document.getElementById("radial").value = String(radial);
}

function setTiming(value) {
    document.getElementById("rangeLabel").innerHTML = "Updates every " + value + " frames";
    framesperchange = Number(value);
    timer = 0;
}

function clearState() {
    for (let i = 0; i < totalfaces; i++) {
        mesh.geometry.faces[i].color.setHex(0x000030);
        mesh.geometry.faces[i].materialIndex = 0;
    }
    mesh.geometry.colorsNeedUpdate = true;
    console.log("cleared");
}

function toggleSim() {
    console.log(!playing);
    playing = !playing;
    timer = 0;
    if (playing) {
        document.getElementById("play").innerHTML = "Pause"
    } else {
        document.getElementById("play").innerHTML = "Play"
    }
}

function openImport() {
    Swal.fire({
        title: "Import Faces",
        html: "<input type='text' id='importval'>",
        confirmButtonText: 'Import',
        focusConfirm: false,
        preConfirm: () => {
            const importval = Swal.getPopup().querySelector('#importval').value;
            if (!importval) {
                Swal.showValidationMessage('Please enter a code');
            } else if (importval[0] != 'a') {
                if(importval.length === 8192){
                    Swal.showValidationMessage('This code is for the main page. Please enter a custom code');
                }else if(importval.length === 32768){
                    Swal.showValidationMessage('This code is for the crazy knot. Please enter a custom code');
                }else{
                   Swal.showValidationMessage('Please enter a custom code');
                }
            }
            return importval
        }
    }).then((result) => {
        if (result.value) {
            importval = result.value;
            setImport();
        }

    })
}

function setImport() {
    p = Number(importval.substring(importval.indexOf("a") + 1, importval.indexOf("b")));
    q = Number(importval.substring(importval.indexOf("b") + 1, importval.indexOf("c")));
    torusrad = Number(importval.substring(importval.indexOf("c") + 1, importval.indexOf("d")));
    tuberad = Number(importval.substring(importval.indexOf("d") + 1, importval.indexOf("e")));
    tubular = Number(importval.substring(importval.indexOf("e") + 1, importval.indexOf("f")));
    radial = Number(importval.substring(importval.indexOf("f") + 1, importval.indexOf("g")));
    totalfaces = tubular * radial;
    setKnot();
    let sequence = importval.substring(importval.indexOf("g") + 1);
    console.log("length: " + sequence.length);
    console.log("total: " + totalfaces);
    for (let i = 0; i < totalfaces; i++){
        let pointer = Number(importval[i]);
        if (pointer === 1) {
            mesh.geometry.faces[i].color.setRGB(0.110, 0.918, 0.259);
            mesh.geometry.faces[i].materialIndex = 1;
        } else {
            mesh.geometry.faces[i].color.setHex(0x000030);
            mesh.geometry.faces[i].materialIndex = 0;
        }
    }
    document.getElementById("p").value = String(p);
    document.getElementById("q").value = String(q);
    document.getElementById("torusrad").value = String(torusrad);
    document.getElementById("tuberad").value = String(tuberad);
    document.getElementById("tubular").value = String(tubular);
    document.getElementById("radial").value = String(radial);
}

function openExport() {
    setExport();
    Swal.fire({
        title: "Copy the following text",
        html: `<input type="text" value="${exportval}" readonly>`,
        confirmButtonText: 'Copied!',
    })
}

function setExport() {
    exportval = "a";
    exportval += String(p);
    exportval += "b";
    exportval += String(q);
    exportval += "c";
    exportval += String(torusrad);
    exportval += "d";
    exportval += String(tuberad);
    exportval += "e";
    exportval += String(tubular);
    exportval += "f";
    exportval += String(radial)
    exportval += "g";
    for (let i = 0; i < totalfaces; i++) {
        exportval += String(mesh.geometry.faces[i].materialIndex);
    }
}

function init() {
    timer = 0;
    scene = new THREE.Scene({ antialias: true });
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(45, winWidth / winHeight, 0.01, 1000);
    camera.position.set(0, 0, 1.5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(winWidth, winHeight);
    document.getElementById("three").appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, document.getElementById("three"));

    setDefault();

    // declare this statmenet whenever u change color
    //mesh.geometry.colorsNeedUpdate = true;

    projector = new THREE.Projector();

    document.getElementById("three").addEventListener("mousedown", onMouseDown);
    function onMouseDown(event) {
        event.preventDefault();//x
        var vector = new THREE.Vector3((event.clientX / winWidth) * 2 - 1, -(event.clientY / winHeight) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);
        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = ray.intersectObjects(objects);
        if (intersects.length > 0) {
            console.log(intersects[0].faceIndex);
            if (mesh.geometry.faces[intersects[0].faceIndex].materialIndex) {
                mesh.geometry.faces[intersects[0].faceIndex].color.setHex(0x000030);
                mesh.geometry.faces[intersects[0].faceIndex].materialIndex = 0;
            } else {
                mesh.geometry.faces[intersects[0].faceIndex].color.setRGB(0.110, 0.918, 0.259);
                mesh.geometry.faces[intersects[0].faceIndex].materialIndex = 1;
            }
            mesh.geometry.colorsNeedUpdate = true;
            console.log(mesh.geometry.faces);
        }
    }

    window.addEventListener('resize', onWindowResize);

}

function update() {
    requestAnimationFrame(update);
    controls.update();
    renderer.render(scene, camera);
    if (timer === (framesperchange - 1)) {
        if (playing) {
            console.log("second");
            getState();
        }
        timer = 0;
    } else {
        timer++;
    }
}

function onWindowResize() {
    camera.aspect = winWidth / winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(winWidth, winHeight);
}

function getState() {
    for (let i = 0; i < totalfaces; i++) {
        setValue(i)
    }
    turnOn.forEach((index) => {
        mesh.geometry.faces[index].color.setRGB(0.110, 0.918, 0.259);
        mesh.geometry.faces[index].materialIndex = 1;
    });
    turnOff.forEach((index) => {
        mesh.geometry.faces[index].color.setHex(0x000030);
        mesh.geometry.faces[index].materialIndex = 0;
    });
    mesh.geometry.colorsNeedUpdate = true;
    turnOn = [];
    turnOff = [];
}

function setValue(index) {
    let neighbourValue = 0;
    //values of neighbours


    // i think all of this is done
    if (index < radial) {
        if (index % radial == 0) {
            //same row
            neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + radial - 1].materialIndex;
            //row below
            neighbourValue += mesh.geometry.faces[index + totalfaces - radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index + totalfaces - radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[totalfaces - 1].materialIndex;
            //row above
            neighbourValue += mesh.geometry.faces[index + radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index + radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + (2 * radial) - 1].materialIndex;
        } else if (index % radial == (radial - 1)) {
            //same row
            neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index - (radial - 1)].materialIndex;
            //row below
            neighbourValue += mesh.geometry.faces[index + totalfaces - radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index + totalfaces - radial - 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + totalfaces - (2 * radial) + 1].materialIndex;
            //row above
            neighbourValue += mesh.geometry.faces[index + radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index + radial - 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
        } else {
            //same row
            neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
            //row below
            neighbourValue += mesh.geometry.faces[index + totalfaces - radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index + totalfaces - radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + totalfaces - radial - 1].materialIndex;
            //row above
            neighbourValue += mesh.geometry.faces[index + radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index + radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + radial - 1].materialIndex;
        }

        // i think this is done

    } else if (index > totalfaces - radial - 1) {
        if (index % radial == 0) {
            //32760
            //same row
            neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + (radial - 1)].materialIndex;
            //row below
            neighbourValue += mesh.geometry.faces[index - radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index - radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
            //row above
            neighbourValue += mesh.geometry.faces[index - totalfaces + radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index - totalfaces + radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index - totalfaces + (2 * radial) - 1].materialIndex;
        } else if (index % radial == (radial - 1)) {
            //32767
            //same row
            neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index - (radial - 1)].materialIndex;
            //row below
            neighbourValue += mesh.geometry.faces[index - radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index - radial - 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index - (2 * radial) + 1].materialIndex;
            //row above
            neighbourValue += mesh.geometry.faces[index - totalfaces + radial].materialIndex;
            neighbourValue += mesh.geometry.faces[0].materialIndex;
            neighbourValue += mesh.geometry.faces[index - totalfaces + radial - 1].materialIndex;
        } else {
            //same row
            neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
            //row below
            neighbourValue += mesh.geometry.faces[index - radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index - radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index - radial - 1].materialIndex;
            //row above
            neighbourValue += mesh.geometry.faces[index - totalfaces + radial].materialIndex;
            neighbourValue += mesh.geometry.faces[index - totalfaces + radial + 1].materialIndex;
            neighbourValue += mesh.geometry.faces[index - totalfaces + radial - 1].materialIndex;
        }



        //these cases are done
    } else if (index % radial === 0) {
        //same row
        neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index + radial - 1].materialIndex;
        //row below
        neighbourValue += mesh.geometry.faces[index - radial].materialIndex;
        neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index - (radial - 1)].materialIndex;
        //row above
        neighbourValue += mesh.geometry.faces[index + radial].materialIndex;
        neighbourValue += mesh.geometry.faces[index + radial + 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index + (2 * radial) - 1].materialIndex;
    } else if (index % radial === (radial - 1)) {
        //same row
        neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index - (radial - 1)].materialIndex;
        //row below
        neighbourValue += mesh.geometry.faces[index - radial].materialIndex;
        neighbourValue += mesh.geometry.faces[index - (radial + 1)].materialIndex;
        neighbourValue += mesh.geometry.faces[index - (2 * radial) + 1].materialIndex;
        //row above
        neighbourValue += mesh.geometry.faces[index + radial].materialIndex;
        neighbourValue += mesh.geometry.faces[index + radial - 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
    } else {
        //same row
        neighbourValue += mesh.geometry.faces[index - 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index + 1].materialIndex;
        //row below
        neighbourValue += mesh.geometry.faces[index - radial].materialIndex;
        neighbourValue += mesh.geometry.faces[index - radial - 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index - radial + 1].materialIndex;
        //row above
        neighbourValue += mesh.geometry.faces[index + radial].materialIndex;
        neighbourValue += mesh.geometry.faces[index + radial - 1].materialIndex;
        neighbourValue += mesh.geometry.faces[index + radial + 1].materialIndex;
    }

    if (mesh.geometry.faces[index].materialIndex) {
        if (!(neighbourValue === 2 || neighbourValue === 3)) {
            console.log("turn off: " + index);
            turnOff.push(index);
        }
    } else {
        if (neighbourValue === 3) {
            console.log("turn on: " + index);
            turnOn.push(index);
        }
    }
}