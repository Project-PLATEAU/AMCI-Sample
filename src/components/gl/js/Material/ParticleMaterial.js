import * as THREE from 'three'
import Core from '../Core'
import vert from './glsl/particle.vert'
import frag from './glsl/particle.frag'

export default class ParticleMaterial extends THREE.ShaderMaterial {

  constructor({tex, size} = {}) {
    const time = Core.time.total
    super({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        time: {value: time},
        size: {value: size},
        tex: {value: tex},
      },
      vertexShader: vert,
      fragmentShader: frag,
    })
  }
}
