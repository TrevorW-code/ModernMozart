// import * as dat from 'dat.gui'
// const additionfile = require('./web_audio.js');
import './style.css'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from "./shaders/shaders";

var vizInit = function (){
  
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var fileLabel = document.querySelector("label.file");
    
    
    document.onload = function(e){
      console.log(e);
      audio.play();
      play();
    }
    file.onchange = function(){
      fileLabel.classList.add('normal');
      audio.classList.add('active');
      var files = this.files;
      
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();
      play();
    }
}

// function play() {
//     var context = new AudioContext();
//     var src = context.createMediaElementSource(audio);
//     var analyser = context.createAnalyser();
//     src.connect(analyser);
//     analyser.connect(context.destination);
//     analyser.fftSize = 512; //1024
//     var bufferLength = analyser.frequencyBinCount;
//     var dataArray = new Uint8Array(bufferLength);
// }
function play() {

    const uniforms = {
        u_time: {
          type: "f",
          value: 1.0,
        },
        u_amplitude: {
          type: "f",
          value: 3.0,
        },
        u_data_arr: {
          type: "float[64]",
          value: dataArray,
        },
        // u_black: { type: "vec3", value: new THREE.Color(0x000000) },
        // u_white: { type: "vec3", value: new THREE.Color(0xffffff) },
      };

    var context = new window.AudioContext();
    var audioElement = document.getElementById("audio");
    var source = context.createMediaElementSource(audioElement)
    var analyser = context.createAnalyser();
    source.connect(analyser)
    analyser.connect(context.destination);
    analyser.fftSize = 1024;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    
    const planeGeometry = new THREE.PlaneGeometry(64,64,64,64);
    // const planeMaterial = new THREE.MeshNormalMaterial({wireframe: true});
    // shader material for control on verticies
    const planeCustomMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader(),
        fragmentShader: fragmentShader(),
        wireframe: true,
    })

    const planeMesh = new THREE.Mesh(planeGeometry,planeCustomMaterial);
    scene.add( planeMesh );

    // formatting
    planeMesh.scale.x = 2 
    planeMesh.scale.y = 2 
    planeMesh.scale.z = 2 
    planeMesh.position.y = 15
    planeMesh.rotation.x = 5.5


    camera.position.z = 125;

    function animate(tick) {
        analyser.getByteFrequencyData(dataArray)
        // console.log(dataArray)

        uniforms.u_time.value = tick;
        uniforms.u_data_arr.value = dataArray;

        requestAnimationFrame( animate );
        // planeMesh.rotation.x += 0.01;
        // planeMesh.rotation.y += 0.01;
        planeMesh.rotation.z += 0.001;

        renderer.render( scene, camera );
    }
    animate();
    
}

window.onload = vizInit();


// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js' // probably will add this last