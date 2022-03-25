import * as THREE from 'three'
import Core from '../Core'
import vert from './glsl/sonicParticle.vert'
import frag from './glsl/sonicParticle.frag'

export default class ParticleShaderMaterial extends THREE.ShaderMaterial {

  constructor({ tex, size } = {}) {

    super({
      vertexShader: vert,
      // fragmentShader: THREE.ShaderLib.standard.fragmentShader,
      fragmentShader: frag,
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib.common,
        THREE.UniformsLib.envmap,
        THREE.UniformsLib.aomap,
        THREE.UniformsLib.lightmap,
        THREE.UniformsLib.emissivemap,
        THREE.UniformsLib.bumpmap,
        THREE.UniformsLib.normalmap,
        THREE.UniformsLib.displacementmap,
        THREE.UniformsLib.roughnessmap,
        THREE.UniformsLib.metalnessmap,
        THREE.UniformsLib.fog,
        THREE.UniformsLib.lights,
        {
          diffuse: { value: new THREE.Color(0xffffff) },
          emissive: { value: new THREE.Color(0x000000) },
          specular: { value: new THREE.Color(0x111111) },
          shininess: { value: 30 },
          roughness: { value: 0.0 },
          metalness: { value: 0.0 },
          envMapIntensity: { value: 0.0 },
        },
        {
          time: { value: 0 }
        }
      ]),
      lights: true,
      fog: true,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: true
    })

  }
}
