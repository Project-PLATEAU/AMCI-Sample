import * as THREE from 'three'
import gsap from 'gsap'

import Light from './Core/Light.js'
import Controls from './Core/Controls.js'
import PostEffect from './Core/PostEffect.js'
import Skybox from './Core/Skybox.js'
import GUI from './Core/GUI.js'
import PositionDebuger from './Core/PositionDebuger.js'
import Loader from './Loader.js'

export default new (class Core {
  /**
   * [constructor description]
   * @return {[type]}       [description]
   */
  constructor() {
    // Stage
    this.scene = null
    this.camera = null
    this.renderer = null

    // Child class
    this.light = null
    this.controls = null
    this.postEffect = null
    this.skybox = null
    this.gui = null

    this.size = {
      windowW: null,
      windowH: null,
    }

    this.clock = null

    this.time = {
      total: 0,
      delta: 0,
    }

    this.white = 0xffffff
    this.black = 0x000000

    this.purple = 0x463c64
    this.pink = 0xef5285
    this.green = 0x00bebe
    this.yellow = 0xebf000

    this.lightPink = 0xf8b2c9

    this.bgGreen = 0x95fffa
    this.bgPink = 0xff5c8e

    this.clearColor = 0x000000
    this.clearAlpha = 0.0

    this.parameters = {
      fogColor: this.white,
    }

    this.cameraPos = new THREE.Vector3(12.3, 1.8, 5.3)
    this.targetPos = new THREE.Vector3()

    this.centers = {
      otemachi: new THREE.Vector3(0.732, 0.0, -4.761),
      marunouchi: new THREE.Vector3(0.828, 0.0, 0.991),
      yurakucho: new THREE.Vector3(-1.739, 0.0, 7.069)
    }

    this.isContentOpen = false

    this.DEFAULT_MAT = 'DefaultMaterial'
    this.PHONG_MAT = 'PhongMaterial'
    this.STANDARD_MAT = 'StandardMaterial'
    this.SHADER_MAT = 'ShaderMaterial'
    this.SDGS_MAT = 'SDGsMaterial'
    this.PROJ_MAT = 'ProjectedMaterial'
  }

  /**
   * [init description]
   * @param  {[type]} $canvas [description]
   * @param  {[type]} debug [description]
   * @return {[type]}         [description]
   */
  init(props) {
    this.setSize()

    // debug
    this.$canvas = props.$canvas
    this.vueContainer = props.vueContainer
    this.debug = props.debug
    this.vue = props.vue

    // GUI
    if(this.debug){
      this.gui = new GUI()
    }

    // Main Scene
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.Fog(this.parameters.fogColor, 10, 40)
    // this.scene.background = new THREE.Color(this.parameters.fogColor)
    // this.scene.background = Loader.getAsset('bg')

    // Front Scene
    this.frontScene = new THREE.Scene()
    this.frontScene.fog = new THREE.Fog(this.parameters.fogColor, 10, 25)

    this.scenes = [
      this.scene,
      this.frontScene
    ]

    // Target
    this.target = new THREE.Object3D()
    this.scene.add(this.target)

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.size.windowW / this.size.windowH, 0.1, 10000)
    this.camera.position.set(this.cameraPos.x, this.cameraPos.y, this.cameraPos.z)
    this.camera.lookAt(this.target)

    // Projection Camera
    this.pcamera = new THREE.PerspectiveCamera(50, 16 / 9, 0.1, 10000)
    this.pcamera.position.set(12, 1, 5.4)
    this.pcamera.lookAt(this.scene.position)

    this.phelper = new THREE.CameraHelper(this.pcamera)
    this.phelper.visible = false
    this.scene.add(this.phelper)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
      antialias: true,
      alpha: true,
    })
    const ratio = Math.min(window.devicePixelRatio, 1.5)
    this.renderer.setPixelRatio(ratio)
    this.renderer.autoClear = false
    this.renderer.setClearColor(this.clearColor, this.clearAlpha)

    this.renderer.setSize(this.size.windowW, this.size.windowH)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Light, Controls, PostEffect...
    this.light = new Light(this.target)
    this.controls = new Controls(this.target)
    this.postEffect = new PostEffect()
    this.skybox = new Skybox()

    // PositionDebuger
    if(this.debug) this.pdebug = new PositionDebuger()

    // Clock
    this.clock = new THREE.Clock()
    this.clock.start()

    this.setupGUI()
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    // Light, Controls, PostEffect...
    this.light.destroy()
    this.controls.destroy()
    this.postEffect.destroy()
    this.skybox.destroy()

    // GUI
    if(this.debug){
      this.gui.destroy()
    }

    // Scene
    this.scene = null
    this.camera = null
    this.renderer = null
  }

  /**
   * [setSize description]
   */
  setSize() {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight,
    }
  }

  /**
   * [resize description]
   * @return {[type]} [description]
   */
  resize() {
    this.setSize()
    if (this.scene) {
      this.camera.aspect = this.size.windowW / this.size.windowH
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(this.size.windowW, this.size.windowH)
      this.postEffect.resize(this.size.windowW, this.size.windowH)
    }
  }

  /**
   * [render description]
   * @return {[type]} [description]
   */
  render() {
    this.time.delta = this.clock.getDelta()
    this.time.total += this.time.delta

    // if(this.pcamera){
    //   this.pcamera.position.x = Math.sin(this.time.total * 0.03) * 10
    //   this.pcamera.updateProjectionMatrix()
    //   this.pcamera.updateMatrixWorld()
    //   this.pcamera.updateWorldMatrix()
    // }
    // if(this.phelper){
    //   this.phelper.update()
    // }

    this.renderer.clear()

    // this.renderer.render(this.scene, this.camera)
    this.light.render(this.time.total)
    this.controls.render()
    // this.postEffect.render()

    this.scenes.forEach((scene) => {
      this.renderer.clearDepth()
      this.renderer.render(scene, this.camera)
    })
  }

  /**
   * [contentOpen description]
   * @return {[type]} [description]
   */
  contentOpen(pos, tpos) {
    if(!pos) pos = new THREE.Vector3(-2.56, 6.08, 12.72)
    if(!tpos) tpos = new THREE.Vector3(-3.45, 1.35, 0.2)
    this.cameraMove(pos, tpos)
    this.isContentOpen = true

    // console.log(this.camera.position)
    // console.log(this.controls.controls)
    // console.log(this.target.position)
  }

  /**
   * [contentClose description]
   * @return {[type]} [description]
   */
  contentClose() {
    const pos = new THREE.Vector3(12.3, 1.8, 5.3)
    const tpos = new THREE.Vector3(0.0, 0.0, 0.0)
    this.cameraMove(pos, tpos)
    this.isContentOpen = false
  }

  /**
   * [cameraMove description]
   * @param  {[type]} pos  [description]
   * @param  {[type]} tpos [description]
   * @return {[type]}      [description]
   */
  cameraMove(pos, tpos) {
    return new Promise((resolve)=>{
      // this.controls.setDisable()
      gsap.to(this.camera.position, {
        x: pos.x,
        y: pos.y,
        z: pos.z,
        duration: 1.0,
        ease: 'circ.inOut',
      })
      gsap.to(this.controls.controls.target, {
        x: tpos.x,
        y: tpos.y,
        z: tpos.z,
        duration: 1.0,
        ease: 'circ.inOut',
        onComplete: () => {
          // this.controls.setEnable()
          return resolve()
        }
      })
    })
  }

  /**
   * [setupGUI description]
   * @return {[type]} [description]
   */
  setupGUI() {
    this.setupPCamGUI()
    this.setupFogGUI()
  }

  /**
   * [setupPCamGUI description]
   * @return {[type]} [description]
   */
  setupPCamGUI() {
    if(this.debug){
      const folder = this.gui.dat.addFolder('Projection Camera')
      // console.log('pcamera', this.pcamera)

      folder.add(this.phelper, 'visible')

      folder
        .add(this.pcamera, 'fov')
        .min(10)
        .max(120)
        .onChange(() => {
          this.updateCameraAndHelper(this.pcamera, this.phelper)
        })

      folder
        .add(this.pcamera.position, 'x')
        .min(-30)
        .max(30)
        .onChange(() => {
          this.updateCameraAndHelper(this.pcamera, this.phelper)
        })
      folder
        .add(this.pcamera.position, 'y')
        .min(-30)
        .max(30)
        .onChange(() => {
          this.updateCameraAndHelper(this.pcamera, this.phelper)
        })
      folder
        .add(this.pcamera.position, 'z')
        .min(-30)
        .max(30)
        .onChange(() => {
          this.updateCameraAndHelper(this.pcamera, this.phelper)
        })
    }
  }

  /**
   * [updateCameraAndHelper description]
   * @param  {[type]} camera [description]
   * @param  {[type]} helper [description]
   * @return {[type]}        [description]
   */
  updateCameraAndHelper(camera, helper) {
    if (camera) {
      camera.lookAt(this.scene.position)
      camera.updateProjectionMatrix()
      camera.updateMatrixWorld()
      camera.updateWorldMatrix()
      camera.needsUpdate = true
    }
    if (helper) {
      helper.update()
    }
  }

  /**
   * [setupFogGUI description]
   * @return {[type]} [description]
   */
  setupFogGUI() {
    if(this.debug){
      const folder = this.gui.dat.addFolder('Fog')
      // folder.open()

      folder.addColor(this.parameters, 'fogColor').onChange(() => {
        this.scene.fog.color.set(this.parameters.fogColor)
        this.scene.background = new THREE.Color(this.parameters.fogColor)
      })

      folder.add(this.scene.fog, 'near').min(1).max(100)
      folder.add(this.scene.fog, 'far').min(1).max(100)
    }
  }

})()
