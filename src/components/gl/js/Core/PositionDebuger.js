import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'
import Core from '../Core'

export default class PositionDebuger {

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.init()
  }


  /**
   * [init description]
   * @return {[type]} [description]
   */
  init() {
    this.setup()
  }


  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {
    this.objects = []

    const size = 0.25
    // const geometry = new THREE.BoxGeometry(size, size, size)
    const geometry = new THREE.SphereGeometry(size, 16, 16)
    const material = new THREE.MeshNormalMaterial({color: 0x00ff00})
    const cube = new THREE.Mesh(geometry, material)
    Core.scene.add(cube)
    this.objects.push(cube)

    const controls = new DragControls(this.objects, Core.camera, Core.renderer.domElement)

    controls.addEventListener('dragstart', (e)=>{
      Core.controls.setDisable()
      // e.object
    })

    controls.addEventListener('drag', (e)=>{
      e.object.position.y = 0
      const x = e.object.position.x
      const z = e.object.position.z
      console.log('object', e.object.position)
      console.log('camera', Core.camera.position)
      // e.object
    })

    controls.addEventListener('dragend', (e)=>{
      Core.controls.setEnable()
      // e.object
    })
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {}


  /**
   * [update description]
   * @return {[type]} [description]
   */
  update() {}


}
