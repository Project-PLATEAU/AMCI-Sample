import * as THREE from 'three'
import Core from '../Core'
import Constants from '../Constants'

export default class Water {

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor() {
    this.object = null
    this.parameters = {
      visible: true
    }
    this.material = null
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
    this.geometry = new THREE.PlaneGeometry(100, 100)
    this.material = new THREE.MeshPhongMaterial({
      color: 0x62f5f5,
      shininess: 120,
      emissive: 0xffff00,
      emissiveIntensity: 0,
      wireframe: false,
      envMap: Core.skybox.cubeTex,
      reflectivity: 0.4,
      transparent: true,
      opacity: 1.0,
      side: THREE.FrontSide
    })
    const plane = new THREE.Mesh(this.geometry, this.material)
    plane.rotation.set(-Math.PI/2, 0, 0)
    plane.position.set(0, 0.01, 0)
    Core.scene.add(plane)

    this.object = plane

    this.setupGUI('Water')
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
  update() {}


  /**
   * [setupGUI description]
   * @return {[type]} [description]
   */
  setupGUI(name) {
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

    folder.add(this.object.position, 'y').min(-0.03).max(0.03).step(0.001)

    this.addMaterialGUI(folder)
    this.addPhongMaterialGUI(folder)
  }

  /**
   * [addMaterialGUI description]
   * @param {[type]} folder [description]
   */
  addMaterialGUI(folder){
    console.log('this.material', this.material)
    // const data = {
    //   // color: this.material.color.getHex(),
    //   // envMaps: envMapKeys[0],
    //   // map: diffuseMapKeys[0],
    //   // alphaMap: alphaMapKeys[0]
    // }

    const f = folder.addFolder( 'THREE.Material')

    f.add(this.material, 'transparent')
    f.add(this.material, 'opacity', 0, 1).step( 0.01)
    f.add(this.material, 'blending', Constants.blendingMode)
    // f.add(this.material, 'blendSrc', Constants.destinationFactors)
    // f.add(this.material, 'blendDst', Constants.destinationFactors)
    // f.add(this.material, 'blendEquation', Constants.equations)
    f.add(this.material, 'depthTest')
    f.add(this.material, 'depthWrite')
    // f.add(this.material, 'polygonOffset')
    // f.add(this.material, 'polygonOffsetFactor')
    // f.add(this.material, 'polygonOffsetUnits')
    f.add(this.material, 'alphaTest', 0, 1).step( 0.01).onChange(this.needsUpdate(this.material, this.object))
    f.add(this.material, 'visible')
    f.add(this.material, 'side', Constants.side).onChange(this.needsUpdate(this.material, this.object))

    return f
  }

  /**
   * [addPhongMaterialGUI description]
   * @param {[type]} folder [description]
   */
  addPhongMaterialGUI(folder){
    const data = {
      color: this.material.color.getHex(),
      emissive: this.material.emissive.getHex(),
      specular: this.material.specular.getHex(),
      // envMaps: envMapKeys[ 0 ],
      // map: diffuseMapKeys[ 0 ],
      // alphaMap: alphaMapKeys[ 0 ]
    }

    const f = folder.addFolder('THREE.MeshPhongMaterial')

    f.addColor(data, 'color').onChange(this.handleColorChange(this.material.color))
    f.addColor(data, 'emissive').onChange(this.handleColorChange(this.material.emissive))
    f.addColor(data, 'specular').onChange(this.handleColorChange(this.material.specular))
    f.add(this.material, 'shininess', 0, 100)
    f.add(this.material, 'flatShading').onChange(this.needsUpdate(this.material, this.object))
    f.add(this.material, 'wireframe')
    // f.add(this.material, 'vertexColors').onChange(this.needsUpdate(this.material, this.object))
    f.add(this.material, 'fog')
    // f.add(data, 'envMaps', envMapKeys).onChange( updateTexture(this.material, 'envMap', envMaps))
    // f.add(data, 'map', diffuseMapKeys).onChange( updateTexture(this.material, 'map', diffuseMaps))
    // f.add(data, 'alphaMap', alphaMapKeys).onChange( updateTexture(this.material, 'alphaMap', alphaMaps))
    f.add(this.material, 'combine', Constants.combine).onChange(this.updateCombine(this.material))
    f.add(this.material, 'reflectivity', 0, 1)
    f.add(this.material, 'refractionRatio', 0, 1)

    return f
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

  /**
   * [updateMaterial description]
   * @param  {[type]} material [description]
   * @return {[type]}          [description]
   */
  updateMaterial(material){
    this.object.traverse((obj) => {
      if(obj.isMesh) {
        obj.material = material
      }
    })
  }

  /**
   * [handleColorChange description]
   * @param  {[type]} color [description]
   * @return {[type]}       [description]
   */
  handleColorChange(color) {
    return function(value) {
      if(typeof value === 'string') {
        value = value.replace('#', '0x')
      }
      color.setHex(value)
    }
  }

  /**
   * [needsUpdate description]
   * @param  {[type]}this.material [description]
   * @param  {[type]} object [description]
   * @return {[type]}          [description]
   */
  needsUpdate(material, object) {
    return function() {
      // material.vertexColors = material.vertexColors
      material.side = parseInt(material.side) // Ensure number
      material.needsUpdate = true

      object.traverse((obj) => {
        if(obj.isMesh) {
          obj.geometry.attributes.position.needsUpdate = true
          obj.geometry.attributes.normal.needsUpdate = true
          if(obj.geometry.attributes.color){
            obj.geometry.attributes.color.needsUpdate = true
          }
        }
      })
    }
  }

  /**
   * [updateCombine description]
   * @param  {[type]}this.material [description]
   * @return {[type]}          [description]
   */
  updateCombine(material) {
    return function(combine) {
      material.combine = parseInt(combine)
      material.needsUpdate = true
    }
  }

  /**
   * [updateTexture description]
   * @param  {[type]}this.material    [description]
   * @param  {[type]}this.material [description]
   * @param  {[type]} textures    [description]
   * @return {[type]}             [description]
   */
  updateTexture(material, materialKey, textures) {
    return function(key) {
     material[materialKey] = textures[key]
      material.needsUpdate = true
    }
  }


}
