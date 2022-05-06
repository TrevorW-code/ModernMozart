// https://stackoverflow.com/questions/23945755/chrome-extension-capture-tab-audio
  // maybe make an extension for part of this? Could be cool --> save links & visualize life
// import * as dat from 'dat.gui'

import './style.css'
import * as THREE from 'three'
import { defaultVertexShader, vertexShader, fragmentShader } from "./shaders/shaders";

// const fs = require('fs');
// const path = require('path');


var vizInit = function (){
  
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var fileLabel = document.querySelector("label.file");
    var fileName = document.getElementById('song_title')
    var upNext = document.getElementById('next_title')



    document.onload = function(e){
      console.log(e);
      audio.play();
      play();
    }
    file.onchange = function(){
      fileLabel.classList.add('normal');
      audio.classList.add('active');
      audio.classList.remove('hidden');
      fileName.classList.add('playing');

      audio.onpause = () => {
        fileName.classList.remove('playing');
        fileName.classList.add('padding');
      }

      audio.onplay = () => {
        fileName.classList.add('playing');
        fileName.classList.remove('padding');
      }

      var playlist = {}
      var files = this.files;
      var num = 0

      audio.onended = () => {
        num += 1;
        console.log('next song')
        audio.src = URL.createObjectURL(playlist[num]); // added random chosen song
        fileName.innerHTML = playlist[num]['name'] // added random chosen song
        upNext.innerHTML = "Next: " + playlist[num+1]['name']
        audio.load();
        audio.play();
        play();
      }

      switch(true) {
        case (files.length<2):
          audio.src = URL.createObjectURL(files[num]); // added random chosen song
          fileName.innerHTML = this.files[num]['name'] // added random chosen song
          audio.load();
          audio.play();
          play();
          break;
        case (files.length>2):
          for (let song in files) {
            playlist[song] = files[song];
          }
          console.log(playlist)
          console.log('test')
          audio.src = URL.createObjectURL(playlist[num]); // added random chosen song
          fileName.innerHTML = playlist[num]['name'] // added random chosen song
          upNext.innerHTML = "Next: " + playlist[num+1]['name']
          audio.load();
          audio.play();
          play();
          // get song from playlist, pass it to audio source?

          // get song name from playlist, get name from files and connect source to file
        }

      // var files = this.files;
      // var num = 0
      // if (files.length < 2) {
      //   num = 0
      // } else {
      //   var num = Math.round(Math.random()*files.length)
      // }
      // console.log(files)
      // console.log(this.files[0]);
      // audio.src = URL.createObjectURL(files[num]); // added random chosen song
      // fileName.innerHTML = this.files[num]['name'] // added random chosen song
      // audio.load();
      // audio.play();
      // play();
    }
}

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
        u_black: { type: "vec3", value: new THREE.Color(0x000000) }, //might not need this
        u_white: { type: "vec3", value: new THREE.Color(0xffffff) }, //might not need this
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
    planeMesh.position.y = 35
    planeMesh.rotation.x = 5.6


    camera.position.z = 120;

    function animate(tick) {
        analyser.getByteFrequencyData(dataArray)
        // console.log(dataArray)

        uniforms.u_time.value = tick;
        uniforms.u_data_arr.value = dataArray;

        requestAnimationFrame( animate );
        planeMesh.rotation.z += 0.003;

        renderer.render( scene, camera );
        
    }
    animate();
    
}

window.onload = vizInit();


// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js' // probably will add this last