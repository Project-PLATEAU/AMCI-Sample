// import {GUI} from '/node_modules/three/examples/jsm/libs/dat.gui.module.js'
let DatGUI = null
if(process.browser){
  DatGUI = require('three/examples/jsm/libs/dat.gui.module.js')
}

export default class GUI{

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(){
    this.dat = new DatGUI.GUI({
      width: 300
    })
    this.dat.close()
  }


  /**
   * [destroy description]
   * @return {[type]} [description]
   */
  destroy(){
    this.dat.destroy()
  }

  /**
   * [render description]
   * @return {[type]} [description]
   */
  render(){
  }

}
