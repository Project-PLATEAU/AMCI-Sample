import Core from '../Core'
import Loader from '../Loader'
import CustomModel from './CustomModel'

export default class Bridge extends CustomModel{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
//   constructor(){
//     super()
//   }

  /**
   * [init description]
   * @return {[type]} [description]
   */
  // init(){
  //   this.setup()
  // }

  /**
   * [setup description]
   * @return {[type]} [description]
   */
  setup(){
    this.object = Loader.getAsset('bridge')
    Core.scene.add(this.object)

    this.saveDefMaterials()

    this.object.traverse((obj) => {
      if(obj.isMesh) {
        // console.log(obj.name, obj)
        // obj.castShadow = true
      }
    })

    this.updateMaterial('DefaultMaterial')

    this.setupGUI('Bridge')
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy(){
  }


  /**
   * [update description]
   * @return {[type]} [description]
   */
  update(){
  }


}
