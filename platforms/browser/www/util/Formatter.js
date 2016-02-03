jQuery.sap.declare('sap.ui.apouni.util.Formatter')

sap.ui.apouni.util.Formatter = {
  checkNumber: function (sInt) {
    if (sInt > 3) {
      return 'Success'
    }
    else if (sInt < 2) {
      return 'Warning'
    }
    return 'None'
  }

}
