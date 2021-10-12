# vis4vis
Copy this code and paste it to web console

```
setTimeout(function(){
    var URL = "http://weihuan.s20.hkustvis.org"
    
    /******Parse script*******/
    var script1 = document.createElement("script")
    script1.async="true"
    script1.src= URL + "/public/proxyend/common/parse.min.js"
    document.body.appendChild(script1);  
    
    /******Collection script*******/
    setTimeout(()=>{
        var script2 = document.createElement("script")
        script2.async="true"
        script2.id="script_mousetrack"
        script2.setAttribute("collection", "voyager");
        // script2.collection="voyager"
        script2.setAttribute("appname", "myAppId");
        // script2.appname="myAppId"
        script2.setAttribute("appkey", "myMasterKey");
        // script2.appkey="myMasterKey"
        script2.setAttribute("parseserver", URL+"/parse");
        // script2.parseserver="https://www.parse.ca.weihuan.tech/parse"
        script2.src= URL + "/public/proxyend/common/mousetrack.js"
        document.body.appendChild(script2);    
    }, 4000)
}, 1000)

```