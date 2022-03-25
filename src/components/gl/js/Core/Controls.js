import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Core from '../Core'

export default class Controls {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(target) {
    this.target = target
    this.isDragged = false
    this.controls = null

    this.controls = new OrbitControls(Core.camera, Core.renderer.domElement)
    this.controls.enabled = true
    this.controls.enableDamping = true
    this.controls.enablePan = true
    this.controls.enableRotate = true
    this.controls.enableZoom = true
    this.controls.dampingFactor = 0.05
    this.controls.minDistance = 2
    this.controls.maxDistance = 20
    this.controls.minPolarAngle = Math.PI * 0.0
    this.controls.maxPolarAngle = Math.PI * 0.5
    this.controls.target.set(0, 1, 0)

    // this.controls.enabled = false

    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 0.1
    this.controls.addEventListener('change', ()=>{
      this.change()
    })
    this.controls.addEventListener('start', ()=>{
      this.start()
    })
    this.controls.addEventListener('end', ()=>{
      this.end()
    })

    this.setupGUI()
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    this.controls.removeEventListener('change')
    this.controls.removeEventListener('start')
    this.controls.removeEventListener('end')
  }

  /**
   * [change description]
   * @return {[type]} [description]
   */
  change() {
    // console.log('change')
  }

  /**
   * [start description]
   * @return {[type]} [description]
   */
  start(){
    this.isDragged = true
  }

  /**
   * [end description]
   * @return {[type]} [description]
   */
  end(){
    this.isDragged = false
  }

  /**
   * [setEnable description]
   */
  setEnable() {
    // this.controls.autoRotate = true
    this.controls.enabled = true
  }

  /**
   * [setDisable description]
   */
  setDisable() {
    // this.controls.autoRotate = false
    this.controls.enabled = false
  }

  /**
   * [toRotateNormal description]
   * @return {[type]} [description]
   */
  toRotateNormal(){
    this.controls.autoRotateSpeed = 0.1
  }

  /**
   * [toRotateSlow description]
   * @return {[type]} [description]
   */
  toRotateSlow(){
    this.controls.autoRotateSpeed = 0.01
  }

  /**
   * [render description]
   * @return {[type]} [description]
   */
  render() {
    this.controls.update()
  }

  /**
   * [setupGUI description]
   * @return {[type]} [description]
   */
  setupGUI() {
    if(Core.debug){
      const folder = Core.gui.dat.addFolder('OrbitControls')
      // folder.open()

      folder.add(this.controls, 'enabled')
      folder.add(this.controls, 'enableDamping')
      folder.add(this.controls, 'enablePan')
      folder.add(this.controls, 'enableRotate')
      folder.add(this.controls, 'enableZoom')
      folder.add(this.controls.target, 'x').min(-20).max(20)
      folder.add(this.controls.target, 'y').min(-20).max(20)
      folder.add(this.controls.target, 'z').min(-20).max(20)
      folder.add(this.controls, 'dampingFactor').min(0).max(0.5).step(0.001)
    }
  }
}
