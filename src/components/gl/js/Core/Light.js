import * as THREE from 'three'
import Core from '../Core'

export default class Light {
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(target) {
    this.target = target
    this.dlight = null
    this.dhelper = null
    // this.alight = null
    this.hlight = null
    // this.plight = null

    this.dlight = new THREE.DirectionalLight(Core.white, 0.55)
    this.dlight.target = target
    // this.castShadow = true
    Core.scene.add(this.dlight)

    this.dhelper = new THREE.DirectionalLightHelper(this.dlight, 5)
    this.dhelper.visible = false
    Core.scene.add(this.dhelper)

    this.alight = new THREE.AmbientLight(Core.white, 0.4)
    Core.scene.add(this.alight)

    this.hlight = new THREE.HemisphereLight(Core.white, Core.bgGreen, 0.1)
    Core.scene.add(this.hlight)

    // this.plight = new THREE.PointLight(Core.white, 0.5)
    // this.plight.target = target
    // this.plight.position.set(3, 10, 3)
    // this.plight.castShadow = true
    // Core.scene.add(this.plight)

    this.setupGUI()
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {
    Core.scene.remove(this.dlight)
    Core.scene.remove(this.dhelper)
    Core.scene.remove(this.alight)
    Core.scene.remove(this.hlight)
  }

  /**
   * [render description]
   * @return {[type]}       [description]
   */
  render() {
    const pos = Core.camera.position
    this.dlight.position.x = pos.x
    this.dlight.position.y = pos.y
    this.dlight.position.z = pos.z
    this.dlight.target = this.target
  }

  /**
   * [setupGUI description]
   * @return {[type]} [description]
   */
  setupGUI() {
    if(Core.debug){
      const folder = Core.gui.dat.addFolder('Light')
      // folder.open()

      this.addLightGUI(folder, this.dlight)
      this.addLightHelperGUI(folder, this.dhelper, 'Directional Helper')
      this.addLightGUI(folder, this.alight)
      this.addLightGUI(folder, this.hlight)
      // let pointFolder = this.addLightGUI(folder, this.plight)
    }
  }

  /**
   * [adAmbientLightGUI description]
   * @param  {[type]} folder [description]
   * @return {[type]}        [description]
   */
  addLightGUI(folder, light) {
    if(Core.debug){
      const data = {
        color: light.color.getHex(),
      }

      if (light.type === 'HemisphereLight') {
        console.log(light)
        data.groundColor = light.groundColor.getHex()
      }

      const f = folder.addFolder(light.type)
      f.add(light, 'visible')
      if (light.type === 'HemisphereLight') {
        f.addColor(data, 'groundColor').onChange(this.handleColorChange(light.groundColor))
      }
      f.addColor(data, 'color').onChange(this.handleColorChange(light.color))
      f.add(light, 'intensity').min(0).max(1).step(0.01)
      f.add(light.position, 'x')
        .min(-30)
        .max(30)
        .onChange(() => {
          light.lookAt(Core.scene.position)
        })
      f.add(light.position, 'y')
        .min(-30)
        .max(30)
        .onChange(() => {
          light.lookAt(Core.scene.position)
        })
      f.add(light.position, 'z')
        .min(-30)
        .max(30)
        .onChange(() => {
          light.lookAt(Core.scene.position)
        })
      return f
    }
  }

  /**
   * [addLightHelperGUI description]
   * @param {[type]} folder [description]
   * @param {[type]} helper [description]
   */
  addLightHelperGUI(folder, helper, name) {
    if(Core.debug){
      const f = folder.addFolder(name)
      f.add(helper, 'visible')
      return f
    }
  }

  /**
   * [handleColorChange description]
   * @param  {[type]} color [description]
   * @return {[type]}       [description]
   */
  handleColorChange(color) {
    return function (value) {
      if (typeof value === 'string') {
        value = value.replace('#', '0x')
      }
      color.setHex(value)
    }
  }
}
