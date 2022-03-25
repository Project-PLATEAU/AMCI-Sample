import * as THREE from 'three'
import {LightProbeGenerator} from 'three/examples/jsm/lights/LightProbeGenerator.js'
import Core from '../Core'
import Loader from '../Loader'

export default class Skybox{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){
    // CubeTexture
    this.cubeTex = Loader.getAsset('skybox')
    this.cubeTex.encoding = THREE.sRGBEncoding
    // Core.scene.background = this.cubeTex

    // Probe
    this.probe = new THREE.LightProbe()
    Core.scene.add(this.probe)
    this.probe.copy(LightProbeGenerator.fromCubeTexture(this.cubeTex))

    // this.createSphere()

    // // gui
    // Core.gui.dat.domElement.style.userSelect = 'none'

    // const fl = Core.gui.dat.addFolder( 'Intensity' )

    // fl.add( API, 'lightProbeIntensity', 0, 1, 0.02 )
    //   .name( 'light probe' )
    //   .onChange(()=>{

    //     lightProbe.intensity = API.lightProbeIntensity
    //     // render()

    //   } )

    // fl.add( API, 'directionalLightIntensity', 0, 1, 0.02 )
    //   .name( 'directional light' )
    //   .onChange(()=>{

    //     directionalLight.intensity = API.directionalLightIntensity
    //     // render()

    //   } )

    // fl.add( API, 'envMapIntensity', 0, 1, 0.02 )
    //   .name( 'envMap' )
    //   .onChange(()=>{

    //     mesh.material.envMapIntensity = API.envMapIntensity
    //     // render()

    //   } )

    // fl.open()
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy(){
    if(Core.scene) Core.scene.remove(this.probe)
    this.removeShepre()
  }


  /**
   * [createDataTexture description]
   * @param  {[type]} w [description]
   * @param  {[type]} h [description]
   * @return {[type]}   [description]
   */
  createDataTexture(w, h){
    const size = w * h

    const data = new Uint8Array(3 * size)
    const color = new THREE.Color(0xffffff)

    const r = Math.floor(color.r * 255) * 0.5
    const g = Math.floor(color.g * 255) * 0.5
    const b = Math.floor(color.b * 255) * 0.5

    for (let i = 0; i < size; i++){
      const stride = i * 3
      data[stride] = r
      data[stride + 1] = g
      data[stride + 2] = b
    }

    return new THREE.DataTexture(data, w, h, THREE.RGBFormat)
  }


  /**
   * [createSphere description]
   * @return {[type]} [description]
   */
  createSphere(){
    // Sphere
    const geometry = new THREE.SphereGeometry(5, 64, 32)
    // const geometry = new THREE.TorusKnotGeometry(4, 1.5, 256, 32, 2, 3)

    const texture = this.createDataTexture(512, 512)

    const material = new THREE.MeshStandardMaterial( {
      color: Core.green,
      metalness: 0,
      roughness: 0,
      envMap: this.cubeTex,
      envMapIntensity: 1.0,
      alphaMap: texture,
      opacity: 0.7
    })

    // mesh
    this.sphere = new THREE.Mesh(geometry, material)
    Core.scene.add(this.sphere)
  }

  /**
   * [removeShepre description]
   * @return {[type]} [description]
   */
  removeShepre(){
    Core.scene.remove(this.sphere)
  }


  /**
   * [render description]
   * @return {[type]}       [description]
   */
  render(){
  }

}
