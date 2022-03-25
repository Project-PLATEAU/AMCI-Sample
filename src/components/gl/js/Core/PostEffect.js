import * as THREE from 'three'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass.js'
// import {FilmPass} from 'three/examples/jsm/postprocessing/FilmPass.js'
import Core from '../Core'

export default class PostEffect{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){
    this.composer = null

    this.composer = new EffectComposer(Core.renderer)

    this.renderPass = new RenderPass(Core.scene, Core.camera)
    this.composer.addPass(this.renderPass)

    this.bloomPass = new UnrealBloomPass(new THREE.Vector2( window.innerWidth, window.innerHeight), 0.12, 0.3, 0.85)
    this.bloomPass.enabled = false
    this.composer.addPass(this.bloomPass)

    this.glitchPass = new GlitchPass()
    this.glitchPass.enabled = false
    this.composer.addPass(this.glitchPass)

    this.setupGUI()
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy(){
  }


  /**
   * [resize description]
   * @return {[type]} [description]
   */
  resize(w, h){
    this.composer.setSize(w, h)
  }

  /**
   * [render description]
   * @return {[type]} [description]
   */
  render(){
    this.composer.render()
  }


  /**
   * [setupGUI description]
   * @return {[type]} [description]
   */
  setupGUI(){
    if(Core.debug){
      const folder = Core.gui.dat.addFolder('PostEffect')
      // folder.open()

      // console.log(this.renderPass)
      // console.log(this.bloomPass)
      // console.log(this.glitchPass)

      const renderFolder = folder.addFolder('RenderPass')
      renderFolder.add(this.renderPass, 'enabled')

      const bloomFolder = folder.addFolder('BloomPass')
      bloomFolder.add(this.bloomPass, 'enabled')
      bloomFolder.add(this.bloomPass, 'threshold').min(0).max(1)
      bloomFolder.add(this.bloomPass, 'strength').min(0).max(1)
      bloomFolder.add(this.bloomPass, 'radius').min(0).max(1)

      const glitchFolder = folder.addFolder('GlitchPass')
      glitchFolder.add(this.glitchPass, 'enabled')
      glitchFolder.add(this.glitchPass, 'goWild')
      glitchFolder.add(this.glitchPass, 'randX').min(0).max(500)

      // folder.add(this.scene.fog, 'near').min(1).max(100)
      // folder.add(this.scene.fog, 'far').min(1).max(100)
    }
  }

}
