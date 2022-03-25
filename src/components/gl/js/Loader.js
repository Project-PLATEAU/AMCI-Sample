import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import Assets from './Assets.js'
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec))

export default new (class Loader {
  /**
   * [constructor description]
   * @return {[type]}       [description]
   */
  constructor() {
    this.assets = Assets
    this.data = null
    this.gltfLoader = null
    this.progressFunc = null
    this.completeFunc = null
  }

  /**
   * [init description]
   * @return {[type]}         [description]
   */
  async init() {
    // Update cube texture url
    for (const key in this.assets) {
      const type = this.assets[key].type
      if (type === 'cube_texture') {
        this.assets[key].url = this.genCubeUrls(this.assets[key].prefix, this.assets[key].postfix)
      }
    }

    // for(const key in this.assets){
    // }

    // Setup loader
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/js/libs/draco/')
    dracoLoader.setDecoderConfig({ type: 'js' })

    this.gltfLoader = new GLTFLoader()
    this.gltfLoader.setDRACOLoader(dracoLoader)

    this.svgLoader = new SVGLoader()

    // Start
    await this.start()
  }

  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy() {}

  /**
   * [start description]
   * @return {[type]} [description]
   */
  async start() {
    let loaded = 0
    const total = Object.keys(this.assets).length
    this.data = {}

    for (const key in this.assets) {
      this.data[key] = await this.load(this.assets[key])
      await sleep(200)
      loaded++

      const cyan = '\u001B[36m'
      console.log(cyan + key + ': (' + loaded + '/' + total + ') Loaded.')

      // Progress
      if (typeof this.progressFunc === 'function') {
        this.progressFunc.call(this, loaded, total)
      }
    }

    this.complete(this.data)
  }

  /**
   * [load description]
   * @param  {[type]} asset [description]
   * @return {[type]}       [description]
   */
  load(asset) {
    return new Promise((resolve) => {
      switch (asset.type) {
        case 'gltf':
          this.gltfLoader.load(asset.url, resolve)
          break
        case 'texture':
          new THREE.TextureLoader().load(asset.url, resolve)
          break
        case 'font':
          new THREE.FontLoader().load(asset.url, resolve)
          break
        case 'cube_texture':
          new THREE.CubeTextureLoader().load(asset.url, resolve)
          break
        case 'json':
          new THREE.JSONLoader().load(asset.url, resolve)
          break
        case 'svg':
          this.svgLoader.load(asset.url, resolve)
          break
        default:
          resolve()
          break
      }
    })
  }

  /**
   * [complete description]
   * @return {[type]} [description]
   */
  complete() {
    console.log('Loader: complete')
    const cyan = '\u001B[36m'
    console.log(cyan + 'Loader: Complete')
    console.log(this.data)

    // console.log('this.completeFunc', this.completeFunc)
    if (typeof this.completeFunc === 'function') {
      this.completeFunc()
    }
  }

  /**
   * [genCubeUrls description]
   * @param  {[type]} prefix  [description]
   * @param  {[type]} postfix [description]
   * @return {[type]}         [description]
   */
  genCubeUrls(prefix, postfix) {
    return [
      prefix + 'px' + postfix,
      prefix + 'nx' + postfix,
      prefix + 'py' + postfix,
      prefix + 'ny' + postfix,
      prefix + 'pz' + postfix,
      prefix + 'nz' + postfix,
    ]
  }

  /**
   * [getAsset description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  getAsset(id) {
    const type = this.assets[id].type
    if (type === 'gltf') {
      return this.data[id].scene
    } else {
      return this.data[id]
    }
  }

  /**
   * [addProgress description]
   * @param {[type]} func [description]
   */
  addProgress(func) {
    console.log('Loader: addProgress', this)
    this.progressFunc = func
  }

  /**
   * [addComplete description]
   * @param {[type]} func [description]
   */
  addComplete(func) {
    console.log('Loader: addComplete', this)
    this.completeFunc = func
  }
})()
