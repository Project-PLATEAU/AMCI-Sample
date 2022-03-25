export default new (class Util {
  /**
   * [constructor description]
   * @return {[type]}       [description]
   */
  constructor() {
  }


  /**
   * [calcAverage description]
   * @param  {[type]} perObj [description]
   * @return {[type]}        [description]
   */
  calcAverage(perObj, averageRatio){
    let max = 0
    let maxKey = 0
    for(let key in perObj){
      let val = perObj[key]
      if(val > max){
        maxKey = key
      }
    }
    perObj[maxKey] *= averageRatio
    for(let key in perObj){
      if(key !== maxKey){
        perObj[key] += perObj[maxKey] * (1 - averageRatio) / 2
      }
    }
    return perObj
  }

})()
