import * as THREE from 'three'
import Constants from '../Constants'
import Core from '../Core'
import MaterialUtils from './MaterialUtils'

export default class MyPhongMaterial extends THREE.MeshPhongMaterial {

  constructor({color = 0xffffff} = {}) {
    super({
      color,
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
        specular: this.specular.getHex(),
        // envMaps: envMapKeys[ 0 ],
        // map: diffuseMapKeys[ 0 ],
        // alphaMap: alphaMapKeys[ 0 ]
      }

      const f = folder.addFolder('THREE.MeshPhongMaterial')

      f.addColor(data, 'color').onChange(MaterialUtils.handleColorChange(this.color))
      f.addColor(data, 'emissive').onChange(MaterialUtils.handleColorChange(this.emissive))
      f.add(this, 'emissiveIntensity', 0, 1)
      f.addColor(data, 'specular').onChange(MaterialUtils.handleColorChange(this.specular))
      f.add(this, 'shininess', 0, 100)
      f.add(this, 'flatShading').onChange(MaterialUtils.needsUpdate(this, this.object))
      f.add(this, 'wireframe')
      // f.add(this, 'vertexColors').onChange(this.needsUpdate(this, this.object))
      f.add(this, 'fog')
      // f.add(data, 'envMaps', envMapKeys).onChange( updateTexture(this, 'envMap', envMaps))
      // f.add(data, 'map', diffuseMapKeys).onChange( updateTexture(this, 'map', diffuseMaps))
      // f.add(data, 'alphaMap', alphaMapKeys).onChange( updateTexture(this, 'alphaMap', alphaMaps))
      f.add(this, 'combine', Constants.combine).onChange(MaterialUtils.updateCombine(this))
      f.add(this, 'reflectivity', 0, 1)
      f.add(this, 'refractionRatio', 0, 1)

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
}
