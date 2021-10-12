export var userInfo = {
    userID: "",
    userList: { "000TT":1, "011TT":1, "022TT":1, "1":1, "000ha":1,"011me":1,"020yo":1,"030xi":1,"041le":1,"051zh":1,"061to":1,"071ki":1,"082mi":1,"092yu":1,"101re":1,"112jo":1,"120mu":1,"132qi":1,"142do":1,"152ze":1,"160ta":1,"171li":1,"181wu":1,"192ja":1,"202zh":1,"211fu":1,"222ke":1,"232yi":1,"241st":1,"252we":1,"260zr":1,"270xi":1,"280yi":1, "290re":1 },
    init(){
        let user = userInfo.checkLogin()
        if(user.length >= 3){
            userInfo.userID = user
            document.getElementById("sid_container").style["display"] = "none"
            document.getElementById("id_exercise").style["display"] = "block"
        }else{
            userInfo.goLogin()
        }
    },
    checkLogin(){
        let cookieName = "userid=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cookieName) == 0) {
                return c.substring(cookieName.length, c.length);
            }
        }
        return "";
    },
    goLogin(){
        document.getElementById("sid_login").addEventListener("click", function() {
            let userid_ = document.getElementById("sid_value").value;
            userInfo.userID = userid
            if (userid_ in userInfo.userList) {
                userid = "ipt_" + userid_;
                document.getElementById("sid_container").style["display"] = "none"
                document.getElementById("id_exercise").style["display"] = "block"
                if (userid_[2] == 1) {
                    document.getElementsByClassName("hints").style["display"] = "block"
                }
                else if (userid_[2] == 2){
                    document.getElementById("hints_2").style["display"] = "block"
                    var hints = document.getElementsByClassName("hints")
                    for(var i=0; i<hints.length; i++){
                        hints[i].style.display = 'none'
                    }
                }
                else{
                    var hints = document.getElementsByClassName("hints")
                    for(var i=0; i<hints.length; i++){
                        hints[i].style.display = 'none'
                    }
                }
                document.cookie = "userid=" + userid;
                userInfo.init()
            } else {
                alert("User ID is not correct!!")
            }
        })
    }
}
userInfo.init()