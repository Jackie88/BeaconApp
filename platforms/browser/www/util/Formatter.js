jQuery.sap.declare('sap.ui.apouni.util.Formatter')

sap.ui.apouni.util.Formatter = {
  checkFavorite: function (sInt) {
    if (sInt == 1) {
      return 'Success'
    }
    return 'None'
  }

}
