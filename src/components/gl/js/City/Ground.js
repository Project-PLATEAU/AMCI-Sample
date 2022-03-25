import * as THREE from 'three'
import Core from '../Core'
import GroundMaterial from '../Material/GroundMaterial'
import SimpleModel from './SimpleModel'

export default class Ground extends SimpleModel {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  //   constructor(){
  //     super()
  //   }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  // init(){
  //   this.setup()
  // }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {
    // this.object = Loader.getAsset('ground')
    // this.material = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: 0xcccccc})
    this.material = new GroundMaterial({})
    this.geometry = new THREE.PlaneGeometry(80, 80)
    this.object = new THREE.Mesh(this.geometry, this.material)
    this.object.rotation.x = (-90 * Math.PI) / 180
    Core.scene.add(this.object)

    this.object.traverse((obj) => {
      if (obj.isMesh) {
        // console.log(obj.name, obj)
        obj.receiveShadow = true
      }
    })

    this.setupGUI('Ground')
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

  /**
   * [setDark description]
   */
  setDark(){
    this.material.uniforms.diffuse.value = new THREE.Color(0xdddddd)
  }

  /**
   * [setDark description]
   */
  setNight(){
    this.material.uniforms.diffuse.value = new THREE.Color(0x111111)
  }

  /**
   * [setDefault description]
   */
  setDefault(){
    this.material.uniforms.diffuse.value = new THREE.Color(0xffffff)
  }
}
