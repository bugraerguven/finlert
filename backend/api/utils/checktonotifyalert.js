/**
 * Determines if an alert should be triggered based on checklogs.
 * 
 * @param {string} type - Either 'TARGET_UPPER' or 'TARGET_LOWER'
 * @param {Array} checklogs - Array of checklog objects (most recent first)
 * @returns {string} 'alert' or 'wait'
 */
function checkToNotifyAlert(type, checklogs) {
    if (!Array.isArray(checklogs) || checklogs.length < 2) {
      return 'wait'; // not enough data
    }
  
    const [latest, previous] = checklogs;
    console.log(type,latest.status,previous.status);
  
    if (
      type === 'TARGET_UPPER' &&
      latest.status === 'ABOVE' &&
      previous.status === 'BELOW'
    ) {
       // console.log("alert");
      return 'alert';
    }
  
    if (
        type === 'TARGET_LOWER' &&
        latest.status === 'BELOW' &&
        previous.status === 'ABOVE'
      ) {
        //console.log("alert");
  
        return 'alert';
      }

      if (
        type === 'TARGET' &&
        latest.status === 'ABOVE' &&
        previous.status === 'BELOW'
      ) {
        //console.log("alert");
  
        return 'alert';
      }

      if (
        type === 'TARGET' &&
        latest.status === 'BELOW' &&
        previous.status === 'ABOVE'
      ) {
        //console.log("alert");
  
        return 'alert';
      }

      if (
        type === 'TARGET_CANAL_INSIDE' &&
        latest.status === 'INSIDE' &&
        previous.status === 'OUTSIDE'
      ) {
        //console.log("alert");
  
        return 'alert';
      }

      if (
        type === 'TARGET_CANAL_OUTSIDE' &&
        latest.status === 'OUTSIDE' &&
        previous.status === 'INSIDE'
      ) {
        //console.log("alert");
  
        return 'alert';
      }

      if (
        type === 'TARGET_TREND_INSIDE' &&
        latest.status === 'INSIDE' &&
        previous.status === 'OUTSIDE'
      ) {
        //console.log("alert");
  
        return 'alert';
      }

      if (
        type === 'TARGET_TREND_OUTSIDE' &&
        latest.status === 'OUTSIDE' &&
        previous.status === 'INSIDE'
      ) {
        //console.log("alert");
  
        return 'alert';
      }
  //console.log("wait");
    return 'wait';

  }
  
  //checkToNotifyAlert('TARGET_UPPER',alerts);
  module.exports = checkToNotifyAlert;