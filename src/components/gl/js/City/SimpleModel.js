import * as THREE from 'three'
import Core from '../Core'
import Constants from '../Constants'
import MaterialUtils from '../Material/MaterialUtils'

export default class SimpleModel {

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.object = null
    this.parameters = {
      visible: true
    }
    this.material = new THREE.MeshPhongMaterial({})

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
    const geometry = new THREE.SphereGeometry(100, 10, 10)
    this.object = new THREE.Mesh(geometry, this.defMat)
    this.setupGUI('SimpleModel')
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    Core.scene.remove(this.object)
  }


  /**
   * [update description]
   * @return {[type]} [description]
   */
  update() {
  }

  /**
   * [saveDefMaterials description]
   */
  saveDefMaterials(){
    /* setup default material */
    this.object.traverse((obj) => {
      if(obj.isMesh) {
        obj.defMat = obj.material
      }
    })
  }

  /**
   * [setupGUI description]
   * @return {[type]} [description]
   */
  setupGUI(name) {
    if(Core.debug){
      const folder = Core.gui.dat.addFolder(name)
      // folder.open()

      folder.add(this.parameters, 'visible')
        .onChange((v) => {
          if(v === true) {
            this.showObject()
          } else {
            this.hideObject()
          }
        })

      this.addMaterialGUI(folder)

      return folder
    }
  }

  /**
   * [addMaterialGUI description]
   * @param {[type]} folder [description]
   */
  addMaterialGUI(folder){
    if(Core.debug){
      console.log(this.material)

      const hasColor = this.material !== 'ShaderMaterial'

      const data = {
        color: 0xffffff
      }

      if(hasColor){
        console.log(this, this.material.type)
        data.color = this.material.color.getHex()
      }

      const f = folder.addFolder('THREE.Material')

      if(hasColor){
        f.addColor(data, 'color').onChange(MaterialUtils.handleColorChange(this.material.color))
      }
      f.add(this.material, 'transparent')
      f.add(this.material, 'opacity', 0, 1).step(0.01)
      f.add(this.material, 'blending', Constants.blendingMode)
      // f.add(this.material, 'blendSrc', Constants.destinationFactors)
      // f.add(this.material, 'blendDst', Constants.destinationFactors)
      // f.add(this.material, 'blendEquation', Constants.equations)
      f.add(this.material, 'depthTest')
      f.add(this.material, 'depthWrite')
      // f.add(this.material, 'polygonOffset')
      // f.add(this.material, 'polygonOffsetFactor')
      // f.add(this.material, 'polygonOffsetUnits')
      f.add(this.material, 'alphaTest', 0, 1).step(0.01).onChange(MaterialUtils.needsUpdate(this.material, this.object))
      f.add(this.material, 'visible')
      f.add(this.material, 'side', Constants.side).onChange(MaterialUtils.needsUpdate(this.material, this.object))

      return f
    }
  }

  /**
   * [showObject description]
   * @return {[type]} [description]
   */
  showObject() {
    this.object.traverse((obj) => {
      if(obj.isMesh) {
        obj.visible = true
      }
    })
  }

  /**
   * [hideObject description]
   * @return {[type]} [description]
   */
  hideObject() {
    this.object.traverse((obj) => {
      if(obj.isMesh) {
        obj.visible = false
      }
    })
  }

}
