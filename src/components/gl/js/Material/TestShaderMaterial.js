import * as THREE from 'three'
import Core from '../Core'
import vertexShader from './glsl/test.vert'
import fragmentShader from './glsl/test.frag'

export default class MyStandardMaterial extends THREE.ShaderMaterial {

  constructor() {
    const time = Core.time.total

    super({
      vertexShader,
      fragmentShader,
      side: THREE.FrontSide,
      uniforms: {
        time: {value: time},
        index: {value: 0},
        total: {value: 0}
      },
    })
  }
}
