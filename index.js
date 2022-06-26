// set inner height and width based on screen size
const winWidth = window.innerWidth;
const winHeight = window.innerHeight;// global vars
let scene, camera, renderer, controls, mesh, projector, materials, wireframe;
let objects = [];


init();

update();

function init() {
  timer = 0;
  scene = new THREE.Scene({ antialias:true });
  scene.background = new THREE.Color( 0x000000 );

  camera = new THREE.PerspectiveCamera(45, winWidth / winHeight, 0.01, 1000);
  camera.position.set(0, 0, 1.5);

  renderer = new THREE.WebGLRenderer({ antialias:true });
  renderer.setSize(winWidth, winHeight);
  document.getElementById("three").appendChild( renderer.domElement );


  controls = new THREE.OrbitControls(camera, document.getElementById("three"));
  let geometry = new THREE.TorusKnotGeometry(0.27, 0.1,256, 32);
  let material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors  } );
  mesh = new THREE.Mesh( geometry, material );
  for(let i=0;i<8192;i++){
    mesh.geometry.faces[ i ].color.setHex( 0x000030 ); 
    mesh.geometry.faces[ i ].materialIndex = 0;
  }
  wireframe = new THREE.WireframeHelper(mesh);
  scene.add(wireframe);
  scene.add(mesh);
  objects = [];
  objects.push(mesh);

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
        if(mesh.geometry.faces[intersects[0].faceIndex].materialIndex){
            mesh.geometry.faces[intersects[0].faceIndex].color.setHex( 0x000030 );
            mesh.geometry.faces[intersects[0].faceIndex].materialIndex = 0;
        }else{
            mesh.geometry.faces[intersects[0].faceIndex].color.setRGB(0.110,0.918,0.259);
            mesh.geometry.faces[intersects[0].faceIndex].materialIndex = 1;
        }
        mesh.geometry.colorsNeedUpdate = true;
        console.log(mesh.geometry.faces);
    }
  }

  window.addEventListener( 'resize', onWindowResize );
 
}

function update() {
  requestAnimationFrame(update);
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = winWidth / winHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(winWidth, winHeight);
}