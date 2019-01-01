import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as THREE from 'three';

class App extends Component {
  randomInRange(from, to) {
    let x = Math.random() * (to - from);
    return x + from;
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    //ADD SCENE
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xababab);
    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(30, width / height, 1, 1000);
    this.camera.position.z = 10;
    this.camera.position.y = 1;
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    //ADD AXES
    this.axes = new THREE.AxesHelper(5);
    this.scene.add(this.axes);

    //ADD CUBE
    let cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
    let cubeGeometry2 = new THREE.BoxGeometry(1, 1, 1);

    //Particles
    this.particlesGeometry = new THREE.Geometry();

    for (let i = 0; i < 100; i++) {
      let x = this.randomInRange(-0.5, 0.5);
      let y = this.randomInRange(-0.5, 0.5);
      let z = this.randomInRange(-0.5, 0.5);

      this.particlesGeometry.vertices.push(new THREE.Vector3(x, y, z));
    }
    //MeshNormalMaterial
    const cubeMaterial1 = new THREE.MeshNormalMaterial({
      color: 0xff0040,
      transparent: true,
      opacity: 0.8,
    });

    //LineBasicMaterial
    const LineBasicMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });

    //LineDashedMaterial
    const LineDashedMaterial = new THREE.LineDashedMaterial({
      color: 0xffffff,
      linewidth: 1,
      dashSize: 0.5,
      gapSize: 0.5,
      scale: 2,
    });

    //Point Material
    const PointMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
    });

    this.cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial1);
    this.cube2 = new THREE.Line(cubeGeometry2, LineBasicMaterial);
    this.cube3 = new THREE.Line(cubeGeometry2, LineDashedMaterial);
    this.cube4 = new THREE.Points(cubeGeometry2, PointMaterial);
    this.partiles = new THREE.Points(this.particlesGeometry, PointMaterial);
    this.cube3.computeLineDistances();

    this.cube1Normal = new THREE.FaceNormalsHelper(this.cube1, 2);
    this.scene.add(this.cube1);
    this.scene.add(this.cube2);
    this.scene.add(this.cube3);
    this.scene.add(this.cube4);
    this.scene.add(this.cube1Normal);
    this.scene.add(this.partiles);

    this.cube2.position.x = -1.5;
    this.cube3.position.x = -1.5;
    this.cube3.position.y = 2;
    this.cube4.position.y = 2;
    this.partiles.position.x = 1.5;
    this.partiles.position.y = 2;
    //ADD Plane
    const planeGeomerty = new THREE.PlaneGeometry(100, 100, 0.1, 0.1);
    const planeMaterial = new THREE.MeshDepthMaterial();
    this.plane = new THREE.Mesh(planeGeomerty, planeMaterial);
    this.plane.rotation.x = -Math.PI / 2;
    this.plane.position.y = -1;

    this.scene.add(this.plane);

    this.start();
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };

  stop = () => {
    cancelAnimationFrame(this.frameId);
  };

  animate = () => {
    this.cube1.rotation.x += 0.01;
    this.cube1.rotation.y += 0.01;

    this.cube2.rotation.y += 0.01;
    this.cube3.rotation.y += 0.01;
    this.cube4.rotation.y += 0.01;
    this.partiles.rotation.y += 0.01;

    for (let i = 0; i < 100; i++) {
      this.partiles.geometry.vertices[i].y -= 0.01;
      if (this.partiles.geometry.vertices[i].y < -0.5) {
        this.partiles.geometry.vertices[i].y = 0.5;
      }
    }
    this.partiles.geometry.verticesNeedUpdate = true;

    this.cube1Normal.update();
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={{ width: '400px', height: '400px' }}
        ref={mount => {
          this.mount = mount;
        }}
      />
    );
  }
}

export default App;
