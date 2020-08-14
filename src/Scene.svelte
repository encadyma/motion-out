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
import { MMDLoader } from 'three/examples/jsm/loaders/MMDLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import { onMount } from 'svelte';

var elem, controls;
var camera, renderer, clock, stats;
var geometry, material, mesh;
var ground, hemiLight, dirLight;

export let asf, scene;
 
onMount(() => {
    init();
    animate();
});

function init() {
 
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.set( 0, 20, 30 );
 
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x1a1a1a );
    // scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

    clock = new THREE.Clock();
 
    geometry = new THREE.BoxGeometry( 0.65, 0.65, 0.65 );
    material = new THREE.MeshNormalMaterial();

    scene.add( new THREE.GridHelper( 100, 40 ) );
    
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
    // scene.add( dirLight );

    ground = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
	ground.rotation.x = - Math.PI / 2;
	ground.receiveShadow = true;
	// scene.add( ground );

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.y = 1;
    scene.add( mesh );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = 'auto';
    stats.domElement.style.bottom = '10px';
    stats.domElement.style.left = 'auto';
    stats.domElement.style.right = '10px';
    elem.appendChild( stats.domElement );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );
    elem.appendChild(renderer.domElement); 

    controls = new OrbitControls( camera, renderer.domElement );
	controls.enablePan = false;
    controls.enableZoom = true;
	controls.update();
}
 
function animate() {
 
    requestAnimationFrame( animate );

    var delta = clock.getDelta();

	if ( asf.baked.mixer ) asf.baked.mixer.update( delta );
 
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.02;

    if (asf.editor.shouldRotate) {
        controls.autoRotate = true;
    } else {
        controls.autoRotate = false;
    }

    controls.update();
    renderer.render( scene, camera );

    stats.update();
}
</script>