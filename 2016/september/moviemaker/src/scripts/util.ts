class Util {
  //Only for Chrome
  private static xmlhttp  = new XMLHttpRequest();

  constructor() {
  }

  public static requestJSON(url: string, callback: any) {
    var xmlhttp = this.xmlhttp;

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
           if(xmlhttp.status == 200){
               callback(xmlhttp.responseText);
           }
           else {
               callback({status : xmlhttp.status});
           }
        }
    }
    
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
  }

};
