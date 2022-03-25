import * as THREE from 'three'
import gsap from 'gsap'
import Core from '../Core'
import Loader from '../Loader'
import BuildingMaterial from '../Material/BuildingMaterial'
import SimpleModel from './SimpleModel'

export default class Buildings extends SimpleModel {
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
    this.height = 0

    this.object = Loader.getAsset('blds')
    Core.scene.add(this.object)

    this.material = new BuildingMaterial({})

    this.object.traverse((obj) => {
      if (obj.isMesh) {
        // console.log(obj.name, obj)
        obj.material = this.material
        obj.castShadow = true
      }
    })

    this.opening()

    // this.setupGUI('Buildings')
  }

  opening() {
    gsap.to(this.material.uniforms.height, {
      value: 0.5,
      duration: 3.0,
      delay: 1.0,
      ease: 'rough',
      repeat: 0,
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

  /**
   * [setDark description]
   */
  setNight(){
    this.material.uniforms.diffuse.value = new THREE.Color(0x222222)
  }

  /**
   * [setDefault description]
   */
  setDefault(){
    this.material.uniforms.diffuse.value = new THREE.Color(0xcccccc)
  }
}
