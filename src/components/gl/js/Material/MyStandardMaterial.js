import * as THREE from 'three'
import Core from '../Core'
import MaterialUtils from './MaterialUtils'

export default class MyStandardMaterial extends THREE.MeshStandardMaterial {

  constructor({_color = 0xffffff} = {}) {
    const def = {
      color: _color,
      opacity: 1.0
    }
    super({
      color: def.color,
      metalness: 0,
      roughness: 0,
      envMap: Core.skybox.cubeTex,
      envMapIntensity: 1.0,
      transparent: true,
      depthTest: true,
      blending: THREE.NormalBlending,
      opacity: def.opacity,
      alphaTest: 0.5,
      depthWrite: true,
      fog: true,
      lights: true,
      side: THREE.FrontSide
    })

    this.default = def
  }

  /**
   * [addMaterialGUI description]
   * @param {[type]} folder [description]
   */
  addMaterialGUI(folder){
    if(Core.debug){
      const data = {
        color: this.color.getHex(),
        emissive: this.emissive.getHex(),
      }

      const f = folder.addFolder('THREE.MeshStandardMaterial')

      f.addColor(data, 'color').onChange(MaterialUtils.handleColorChange(this.color))
      f.addColor(data, 'emissive').onChange(MaterialUtils.handleColorChange(this.emissive))
      f.add(this, 'emissiveIntensity', 0, 1)
      f.add(this, 'flatShading').onChange(MaterialUtils.needsUpdate(this, this.object))
      f.add(this, 'wireframe')
      f.add(this, 'fog')

      return f
    }
  }

  setDefault(){
    this.color = this.default.color
    this.opacity = this.default.opacity
  }

  setGreen(){
    this.color = new THREE.Color(0x4ac144)
    this.opacity = 0.9
  }

  setBlue(){
    this.color = new THREE.Color(0x0066ff)
    this.opacity = 0.9
  }

  setOrange(){
    this.color = new THREE.Color(0xff7700)
    this.opacity = 0.9
  }

  setTransparent(){
    this.color = new THREE.Color(0xdddddd)
    this.opacity = 0.95
  }
}
