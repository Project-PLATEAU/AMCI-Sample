import * as THREE from 'three'
import Core from '../Core'
import Loader from '../Loader'

export default class RingTexts {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.material = null
    this.geometry = null
    this.mesh = null

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
    this.texture = Loader.getAsset('bgtext')
    this.texture.wrapS = THREE.RepeatWrapping
    this.texture.repeat.x = -1

    this.material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.5,
      map: this.texture,
    })
    this.geometry = new THREE.CylinderGeometry(15, 15, 6, 16, 4, true)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    Core.scene.add(this.mesh)

    this.mesh.position.y = 4
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
  update() {
    this.mesh.rotation.y -= 0.0005
  }

  /**
   * [show description]
   * @return {[type]} [description]
   */
  show() {
    this.mesh.visible = true
  }

  /**
   * [hide description]
   * @return {[type]} [description]
   */
  hide() {
    this.mesh.visible = false
  }

  /**
   * [toThin description]
   * @return {[type]} [description]
   */
  toThin(){
    this.material.opacity = 0.2
  }

  /**
   * [toVeryThin description]
   * @return {[type]} [description]
   */
  toVeryThin(){
    this.material.opacity = 0.05
  }

  /**
   * [toDefault description]
   * @return {[type]} [description]
   */
  toDefault(){
    this.material.opacity = 0.5
  }
}
