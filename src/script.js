
// import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
// import * as dat from 'dat.gui'
import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// basic cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

const planeGeometry = new THREE.PlaneGeometry(64,64,64,64);
const planeMaterial = new THREE.MeshNormalMaterial({wireframe: true});
const planeMesh = new THREE.Mesh(planeGeometry,planeMaterial);
scene.add( planeMesh );

// formatting
planeMesh.scale.x = 2 
planeMesh.scale.y = 2 
planeMesh.scale.z = 2 
planeMesh.position.y = 15
planeMesh.rotation.x = 5.5


camera.position.z = 100;

function animate() {
    requestAnimationFrame( animate );
    // planeMesh.rotation.x += 0.01;
    // planeMesh.rotation.y += 0.01;
    renderer.render( scene, camera );
}

animate();