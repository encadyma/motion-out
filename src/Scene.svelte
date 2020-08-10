<div id="scene" bind:this="{elem}">
</div>

<style>
#scene {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
}
</style>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { onMount } from 'svelte';

var elem;
var camera, renderer;
var geometry, material, mesh;
var ground, hemiLight, dirLight;

export let asf, scene;
 
onMount(() => {
    init();
    animate();
});

function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
    camera.position.set( - 1, 2, 3 );
 
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x1a1a1a );
    // scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
 
    geometry = new THREE.BoxGeometry( 0.65, 0.65, 0.65 );
    material = new THREE.MeshNormalMaterial();
    
    // Attach hemisphere and directional lighting
    // Scene courtesy of mrdoob three.js official examples
    hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    dirLight = new THREE.DirectionalLight( 0xffffff );
	dirLight.position.set( 3, 10, 10 );
	dirLight.castShadow = true;
	dirLight.shadow.camera.top = 2;
	dirLight.shadow.camera.bottom = - 2;
	dirLight.shadow.camera.left = - 2;
	dirLight.shadow.camera.right = 2;
	dirLight.shadow.camera.near = 0.1;
	dirLight.shadow.camera.far = 40;
    scene.add( dirLight );

    ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;
	scene.add( ground );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 1;
    scene.add( mesh );
 
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    elem.appendChild(renderer.domElement); 

    var controls = new OrbitControls( camera, renderer.domElement );
	controls.enablePan = false;
    controls.enableZoom = true;
	controls.update();
}
 
function animate() {
 
    requestAnimationFrame( animate );
 
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;
 
    renderer.render( scene, camera );
 
}
</script>