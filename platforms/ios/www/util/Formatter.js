jQuery.sap.declare("sap.ui.apouni.util.Formatter");

sap.ui.apouni.util.Formatter = {
    
    // Deklaracja metod formatter
    checkNumber : function(sInt) {
        
        if (sInt>2) {
            return "Success";
        } else if (sInt < 2) {
            return "Warning";
        }
        return "none";
    }

};