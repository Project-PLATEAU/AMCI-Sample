import * as THREE from 'three'
import Core from '../Core'
import vert from './glsl/sdgs.vert'
import frag from './glsl/sdgs.frag'

export default class SDGsMaterial extends THREE.ShaderMaterial {
  constructor() {
    const time = Core.time.total

    super({
      side: THREE.DoubleSide,
      lights: true,
      fog: true,
      transparent: true,
      blending: THREE.NormalBlending,
      // blending: THREE.AdditiveBlending,
      depthWrite: true,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.common,
        THREE.UniformsLib.specularmap,
        THREE.UniformsLib.envmap,
        THREE.UniformsLib.aomap,
        THREE.UniformsLib.lightmap,
        THREE.UniformsLib.emissivemap,
        THREE.UniformsLib.bumpmap,
        THREE.UniformsLib.normalmap,
        THREE.UniformsLib.displacementmap,
        THREE.UniformsLib.fog,
        THREE.UniformsLib.lights,
        {
          diffuse: { value: new THREE.Color(0xcccccc) },
          emissive: { value: new THREE.Color(0x999999) },
          specular: { value: new THREE.Color(0x111111) },
          shininess: { value: 120 },
          opacity: { value: 0.8 },
        },
        {
          time: { value: time },
          index: {value: 0},
          total: {value: 0},
          actColor : {value: new THREE.Color(0xffff00)},
        },
      ]),
      vertexShader: vert,
      fragmentShader: frag,
    })

    this.type = 'SDGsMaterial'
    this.color = new THREE.Color(0x000000)
    this.specular = new THREE.Color(0x111111)
    this.shininess = 30

    this.map = null

    this.lightMap = null
    this.lightMapIntensity = 1.0

    this.aoMap = null
    this.aoMapIntensity = 1.0

    this.emissive = new THREE.Color(0xffffff)
    this.emissiveIntensity = 2.0
    this.emissiveMap = null

    this.bumpMap = null
    this.bumpScale = 1

    this.normalMap = null
    this.normalMapType = THREE.TangentSpaceNormalMap
    this.normalScale = new THREE.Vector2(1, 1)

    this.displacementMap = null
    this.displacementScale = 1
    this.displacementBias = 0

    this.specularMap = null

    this.alphaMap = null

    this.envMap = null
    this.combine = THREE.MultiplyOperation
    this.reflectivity = 1
    this.refractionRatio = 0.98

    this.wireframe = false
    this.wireframeLinewidth = 1
    this.wireframeLinecap = 'round'
    this.wireframeLinejoin = 'round'

    this.flatShading = false

    this.COLORS = [
      new THREE.Color(0xD6252E),
      new THREE.Color(0xC89931),
      new THREE.Color(0x2B9144),
      new THREE.Color(0xAF2534),
      new THREE.Color(0xDB3F31),
      new THREE.Color(0x04A2C6),
      new THREE.Color(0xF2B02B),
      new THREE.Color(0x7B1E33),
      new THREE.Color(0xE3652B),
      new THREE.Color(0xCD1E77),
      new THREE.Color(0xEB9533),
      new THREE.Color(0xC28431),
      new THREE.Color(0x466E3A),
      new THREE.Color(0x0173A7),
      new THREE.Color(0x3DA448),
      new THREE.Color(0x164B77),
      new THREE.Color(0x1D2E51)
    ]
  }
}
