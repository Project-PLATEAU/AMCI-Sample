import * as THREE from 'three'
import Core from '../Core'
import vert from './glsl/leafParticle.vert'
import frag from './glsl/leafParticle.frag'

export default class LeafParticleMaterial extends THREE.ShaderMaterial {

  constructor({ tex, size } = {}) {

    const uniforms = THREE.UniformsUtils.merge([
      THREE.ShaderLib.standard.uniforms,
      {
        time: { value: 0 },
        diffuse: {value: new THREE.Vector3(0.0, 1.0, 0.3)},
        roughness: {value: 1.0},
      }
    ])

    super({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: uniforms,
      lights: true,
      side: THREE.DoubleSide
    })

  }
}
