import * as THREE from 'three'
import Core from '../Core'
import Constants from '../Constants'
import MyPhongMaterial from '../Material/MyPhongMaterial'
import MyStandardMaterial from '../Material/MyStandardMaterial'
import TestShaderMaterial from '../Material/TestShaderMaterial'
import SDGsMaterial from '../Material/SDGsMaterial'
import MaterialUtils from '../Material/MaterialUtils'
import ProjectedMaterial from '../Material/ProjectedMaterial'
import AnimationRender from '../Material/AnimationRender'

export default class CustomModel {

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

    this.defMat = null
    this.phongMat = null
    this.stanMat = null
    this.shaderMat = null
    this.sdgsMat = null
    this.projMat = null

    this.currentMatKey = {current: ''}

    this.init()
  }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  init() {
    this.setupMaterials()
    this.setup()
  }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup() {
    this.geometry = new THREE.SphereGeometry(1, 1, 1)
    this.object = new THREE.Mesh(geometry, this.defMat)

    this.setupAfter({
      current: Core.PHONG_MAT,
      folder: 'CustomModel'
    })
  }

  /**
   * [setupMaterials description]
   * @return {[type]} [description]
   */
  setupMaterials() {
    this.animationRender = new AnimationRender()

    this.defMat = new THREE.MeshPhongMaterial({})
    this.phongMat = new MyPhongMaterial()
    this.stanMat = new MyStandardMaterial()
    this.shaderMat = new TestShaderMaterial()
    this.sdgsMat = new SDGsMaterial()
    this.projMat = this.addProjectedMaterial(this.animationRender)

    this.materials = {
      [Core.DEFAULT_MAT]: this.defMat,
      [Core.PHONG_MAT]: this.phongMat,
      [Core.STANDARD_MAT]: this.stanMat,
      [Core.SHADER_MAT]: this.shaderMat,
      [Core.SDGS_MAT]: this.sdgsMat,
      [Core.PROJ_MAT]: this.projMat
    }
  }

  /**
   * [setupAfter description]
   * @param  {[type]} data [description]
   * @return {[type]}   [description]
   */
  setupAfter(data){
    console.log('setupAfter', data)

    this.castShadow()
    this.saveDefMaterials()
    this.updateMaterial(data.current)

    this.setupGUI(data.folder)
  }

  /**
   * [castShadow description]
   * @return {[type]} [description]
   */
  castShadow(){
    this.object.traverse((obj) => {
      if(obj.isMesh) {
        // console.log(obj.name, obj)
        obj.castShadow = true
      }
    })
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    Core.scene.remove(this.object)
    this.animationRender.destroy()
  }

  /**
   * [addProjectedMaterial description]
   */
  addProjectedMaterial(render){
    const material = new ProjectedMaterial({
      camera: Core.pcamera,
      // texture: Loader.getAsset('uv'),
      texture: render.texture,
      color: '#ffffff',
    })
    return material
  }

  /**
   * [update description]
   * @return {[type]} [description]
   */
  update() {
    if(this.object){
      this.updateUniforms()
      this.updateAnimationRender()
      this.updateObject()
    }
  }

  /**
   * [updateUniforms description]
   * @return {[type]} [description]
   */
  updateUniforms(){
    this.object.traverse((obj) => {
      if(obj.isMesh) {
        if(this.currentMatKey.current === Core.SHADER_MAT || this.currentMatKey.current === Core.SDGS_MAT){
          if(obj.material.uniforms){
            const time = Core.time.total
            obj.material.uniforms.time.value = time
          }
        }
      }
    })
  }

  /**
   * [updateAnimationRender description]
   * @return {[type]} [description]
   */
  updateAnimationRender(){
    if(this.animationRender && this.currentMatKey.current === Core.PROJ_MAT){
      // update canvas
      this.animationRender.update(Core.time)

      // update uniform
      const pmat = this.materials.ProjectedMaterial
      if(pmat) pmat.uniforms.tex.value = this.animationRender.texture
    }

    // update camera
    if(Core.pcamera.needsUpdate === true){
      this.updateProejctionCamera(Core.pcamera)
    }
  }

  /**
   * [updateProejctionCamera description]
   * @param  {[type]} camera [description]
   * @return {[type]}        [description]
   */
  updateProejctionCamera(camera){
    this.materials.ProjectedMaterial.updateCamera(camera)
    camera.needsUpdate = false
  }

  /**
   * [updateObject description]
   * @return {[type]} [description]
   */
  updateObject(){
  }

  /**
   * [saveDefMaterials description]
   */
  saveDefMaterials(){
    console.log(this.object)
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

      folder.add(this.currentMatKey, 'current', Object.keys(this.materials))
      .onChange((value) => {
        console.log('value:', value, ', material:', this.currentMatKey)
        this.updateMaterial(value)
      })

      // this.addMaterialGUI(folder)
      this.phongMat.addMaterialGUI(folder)
      this.stanMat.addMaterialGUI(folder)

      return folder
    }
  }

  /**
   * [addMaterialGUI description]
   * @param {[type]} folder [description]
   */
  addMaterialGUI(folder){
    if(Core.debug){
      // const data = {
      //   color: this.phongMat.color.getHex(),
      //   // envMaps: envMapKeys[0],
      //   // map: diffuseMapKeys[0],
      //   // alphaMap: alphaMapKeys[0]
      // }

      const f = folder.addFolder( 'THREE.Material')

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
   * [getMaterial description]
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  getMaterial(key){
    return this.materials[key]
  }

  /**
   * [updateMaterial description]
   * @param  {[type]} key [description]
   * @return {[type]}     [description]
   */
  updateMaterial(key){
    this.currentMatKey.current = key
    const material = this.materials[key]

    if(key === 'DefaultMaterial'){
      this.setDefMaterials()
    }
    else{
      this.setMaterials(key, material)
    }

    this.material = material

    return material
  }

  /**
   * [setDefMaterials description]
   */
  setDefMaterials(){
    this.object.traverse((obj) => {
      if(obj.isMesh) {
        obj.material = obj.defMat
      }
    })
  }

  /**
   * [setMaterials description]
   * @param {[type]} key [description]
   * @param {[type]} material [description]
   */
  setMaterials(key, material){
    let count = 0
    const total = this.object.children.length
    // const total = this.object.children[0].children.length //lod1

    console.log('setMaterials', key, material, this.object)

    /* update total */
    if(key === Core.SHADER_MAT || key === Core.SDGS_MAT){
      // console.log('this.object', this.object)
      material.uniforms.total.value = total
    }

    this.object.traverse((obj) => {
      if(obj.isMesh) {
        if(key === Core.SHADER_MAT || key === Core.SDGS_MAT){
          // console.log(count +' / '+total)
          const cloneMat = material.clone()
          cloneMat.uniforms.index.value = count
          obj.material = cloneMat
          // if(count === 0) console.log(obj)
          count++
        }
        else{
          obj.material = material
        }
      }
    })

    /* count debug */
    // this.object.traverse((obj) => {
    //   if(obj.isMesh) {
    //     console.log(obj.material.uniforms.index.value)
    //   }
    // })
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
