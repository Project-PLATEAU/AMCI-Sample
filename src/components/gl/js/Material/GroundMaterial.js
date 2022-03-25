import * as THREE from 'three'
import Core from '../Core'
import vertexShader from './glsl/ground.vert'
import fragmentShader from './glsl/ground.frag'

export default class GroundMaterial extends THREE.ShaderMaterial {
  constructor() {
    const time = Core.time.total

    super({
      side: THREE.DoubleSide,
      lights: true,
      fog: true,
      transparent: true,
      blending: THREE.NormalBlending,
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
          diffuse: { value: new THREE.Color(0xffffff) },
          emissive: { value: new THREE.Color(0x000000) },
          specular: { value: new THREE.Color(0x111111) },
          shininess: { value: 30 },
          opacity: { value: 1.0 },
        },
        {
          time: { value: time },
        },
      ]),
      vertexShader,
      fragmentShader,
    })

    this.type = 'GroundMaterial'
    this.color = new THREE.Color(0x000000)
    this.specular = new THREE.Color(0x111111)
    this.shininess = 30

    this.map = null

    this.lightMap = null
    this.lightMapIntensity = 1.0

    this.aoMap = null
    this.aoMapIntensity = 1.0

    this.emissive = new THREE.Color(0x000000)
    this.emissiveIntensity = 1.0
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
  }
}
