function getCookie(e){let t=e+"=",i=decodeURIComponent(document.cookie).split(";");for(let n=0;n<i.length;n++){let o=i[n];for(;" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""}
function setCookie(e,t,i){let n=new Date;n.setTime(n.getTime()+864e5*i);let o="expires="+n.toUTCString();document.cookie=e+"="+t+";"+o+";path=/"}

const all_evidence = ["ESG","EMF 5","Fingerprints","Freezing","Ectoplasm","Easel","Spirit Box"]
const all_ghosts = ["Spirit","Wraith","Phantom","Poltergeist","Banshee","Jinn","Mare","Revenant","Shade","Demon","Yurei","Oni","Yokai","Hantu","Goryo","Myling","Onryo","The Twins","Raiju","Obake","The Mimic","Moroi","Deogen","Thaye"]
const all_speed = ["Slow","Normal","Fast"]

var state = {"evidence":{},"speed":{"Slow":0,"Normal":0,"Fast":0},"ghosts":{}}
var user_settings = {"num_evidences":3,"ghost_modifier":2,"volume":50,"offset":0,"sound_type":0,"speed_logic_type":0}

let hasLink = false;

function loadData(){
    fetch("data/ghosts.json", {signal: AbortSignal.timeout(2000)})
    .then(data => data.json())
    .then(data => {

        var cards = document.getElementById('cards')
        var cur_version = document.getElementById('current-version-label')
        var evidence_list = document.getElementById('evidence')

        evidence_list.innerHTML = "";
        for(var i = 0; i < data.evidence.length; i++){
            evidence_list.innerHTML += `
            <button id="${data.evidence[i]}" class="tricheck white" name="evidence" onclick="tristate(this)" value="${data.evidence[i]}">
                <div id="checkbox" class="neutral"><span class="icon"></span></div>
                <div class="label">${data.evidence[i]}</div>
            </button>
            `
        }

        cards.innerHTML = "";
        for(var i = 0; i < data.ghosts.length; i++){
            var ghost = new Ghost(data.ghosts[i]);
            cards.innerHTML += `${ghost.ghostTemplate}`
        }
        //cur_version.innerHTML = `${data.version}`

        var start_state = getCookie("state")

        for (var i = 0; i < all_evidence.length; i++){
            state["evidence"][all_evidence[i]] = 0
        }
        for (var i = 0; i < all_ghosts.length; i++){
            state["ghosts"][all_ghosts[i]] = 1
        }
        
        if (!start_state){
            start_state = state;
        }
        else{
            start_state = JSON.parse(start_state)
        }
    
        for (const [key, value] of Object.entries(start_state["ghosts"])){ 
            if (value == 0){
                fade(document.getElementById(key));
            }
            else if (value == -1){
                remove(document.getElementById(key));
            }
            else if (value == 2){
                select(document.getElementById(key));
            }
        }
        for (const [key, value] of Object.entries(start_state["evidence"])){ 
            if (value == 1){
                tristate(document.getElementById(key));
            }
            else if (value == -1){
                tristate(document.getElementById(key));
                tristate(document.getElementById(key));
            }
        }
        for (const [key, value] of Object.entries(start_state["speed"])){ 
            if (value == 1){
                $("#"+key)[0].click();
            }
        }
        
        filter()

    })
    .catch(error => {

        fetch("data/ghosts.json")
        .then(data => data.json())
        .then(data => {
            var cards = document.getElementById('cards')
            var cur_version = document.getElementById('current-version-label')
            var evidence_list = document.getElementById('evidence')

            evidence_list.innerHTML = "";
            for(var i = 0; i < data.evidence.length; i++){
                evidence_list.innerHTML += `
                <button id="${data.evidence[i]}" class="tricheck phasfont white" name="evidence" onclick="tristate(this)" value="${data.evidence[i]}">
                    <div id="checkbox" class="neutral"><span class="icon"></span></div>
                    <div class="label">${data.evidence[i]}</div>
                </button>
                `
            }
            cards.innerHTML = "";
            for(var i = 0; i < data.ghosts.length; i++){
                var ghost = new Ghost(data.ghosts[i]);
                cards.innerHTML += `${ghost.ghostTemplate}`
            }
            document.getElementById("currentVersion").innerHTML = `${data.version}`
            filter()
        })
    })
}

function dualstate(elem,ignore_link=false){
    var checkbox = $(elem).find("#checkbox");

    if (checkbox.hasClass("disabled")){
        return;
    }

    if (checkbox.hasClass("neutral")){
        checkbox.removeClass("neutral")
        checkbox.addClass("good")
    }
    else if (checkbox.hasClass("good")){
        checkbox.removeClass("good")
        checkbox.addClass("neutral")
    }

    if(!ignore_link){filter(ignore_link)}
}

function tristate(elem,ignore_link=false){
    var checkbox = $(elem).find("#checkbox");
    var label = $(elem).find(".label");

    if (checkbox.hasClass("disabled")){
        return;
    }

    if (checkbox.hasClass("neutral")){
        checkbox.removeClass("neutral")
        checkbox.addClass("good")
    }
    else if (checkbox.hasClass("good")){
        checkbox.removeClass("good")
        checkbox.addClass("bad")
        label.addClass("strike")
    }
    else if (checkbox.hasClass("bad")){
        checkbox.removeClass("bad")
        label.removeClass("strike")
        checkbox.addClass("neutral")
    }

    if(!ignore_link){filter(ignore_link)}
}

function select(elem,ignore_link=false){
    if (!$(elem).hasClass("faded")){
        var on = false
        if (!ignore_link){

            on = $(elem).hasClass("selected")

            for (const [key, value] of Object.entries(state["ghosts"])){ 
                if(value == 2){
                    state['ghosts'][key] = 1
                    document.getElementById(key).className = "ghost_card"
                }
            }
        }

        if (on){
            $(elem).removeClass("selected");
            state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 1;
        }
        else{
            $(elem).addClass("selected");
            state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 2;
        }
        setCookie("state",JSON.stringify(state),1)
        if (hasLink && !ignore_link){send_state()}
    }
}

function fade(elem,ignore_link=false){
    if(!ignore_link){
        if (state["ghosts"][$(elem).find(".ghost_name")[0].innerText] != 0){
            state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 0;
        }
        else{
            state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 1;
        }
    }
    $(elem).toggleClass("faded");
    $(elem).removeClass("selected");
    $(elem).find(".ghost_name").toggleClass("strike");
    setCookie("state",JSON.stringify(state),1)
    if (hasLink && !ignore_link){send_state()}
}

function remove(elem,ignore_link=false){
    state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = -1;
    $(elem).addClass("permhidden");
    setCookie("state",JSON.stringify(state),1)
    if (hasLink && !ignore_link){send_state()}
}

function filter(ignore_link=false){
    state["evidence"] = {}
    state["speed"] = {"Slow":0,"Normal":0,"Fast":0}
    for (var i = 0; i < all_evidence.length; i++){
        state["evidence"][all_evidence[i]] = 0
    }

    // Get values of checkboxes
    var base_speed = 1.7;
    var evi_array = [];
    var not_evi_array = [];
    var spe_array = [];
    var good_checkboxes = document.querySelectorAll('[name="evidence"] .good');
    var bad_checkboxes = document.querySelectorAll('[name="evidence"] .bad');
    var speed_checkboxes = document.querySelectorAll('[name="speed"] .good');
    var num_evidences = document.getElementById("num_evidence").value
    //var speed_logic_type = document.getElementById("speed_logic_type").checked ? 1 : 0;

    for (var i = 0; i < good_checkboxes.length; i++) {
        evi_array.push(good_checkboxes[i].parentElement.value);
        state["evidence"][good_checkboxes[i].parentElement.value] = 1;
    }

    for (var i = 0; i < bad_checkboxes.length; i++) {
        not_evi_array.push(bad_checkboxes[i].parentElement.value);
        state["evidence"][bad_checkboxes[i].parentElement.value] = -1;
    }

    for (var i = 0; i < speed_checkboxes.length; i++) {
        spe_array.push(speed_checkboxes[i].parentElement.value);
        state["speed"][speed_checkboxes[i].parentElement.value] = 1;
    }


    // Filter other evidences
    for (var i = 0; i < all_evidence.length; i++){
        var checkbox = document.getElementById(all_evidence[i]);
        $(checkbox).removeClass("block")
        $(checkbox).find("#checkbox").removeClass(["block","disabled"])
        $(checkbox).find(".label").removeClass("disabled-text")
    }
    // Filter other evidences
    for (var i = 0; i < all_speed.length; i++){
        var checkbox = document.getElementById(all_speed[i]);
        $(checkbox).removeClass("block")
        $(checkbox).find("#checkbox").removeClass(["block","disabled"])
        $(checkbox).find(".label").removeClass("disabled-text")
    }

    // Get all ghosts
    var ghosts = document.getElementsByClassName("ghost_card")
    var keep_evidence = new Set();
    var keep_speed = new Set();
    var mimic_evi = []
    var mimic_nm_evi = ""

    for (var i = 0; i < ghosts.length; i++){
        var keep = true;
        var name = ghosts[i].getElementsByClassName("ghost_name")[0].textContent;
        var evi_objects = ghosts[i].getElementsByClassName("ghost_evidence_item")
        var evidence = []
        for (var j = 0; j < evi_objects.length; j++){evidence.push(evi_objects[j].textContent)}
        var nm_evidence = 3;
        //var speed = ghosts[i].getElementsByClassName("ghost_speed")[0].textContent;
        if (name == "The Mimic"){
            evidence.push("Ghost Orbs")
            mimic_evi = evidence
            nm_evidence = "Ghost Orbs"
            mimic_nm_evi = "Ghost Orbs"
        }
        

        // Check for evidences
        // Standard
        if (evi_array.length > 0){
            evi_array.forEach(function (item,index){
                if(!evidence.includes(item)){
                    keep = false
                }
            });
        }

        if (not_evi_array.length > 0){
            not_evi_array.forEach(function (item,index){
                if(evidence.includes(item)){
                    keep = false
                }
            });
        }

        ghosts[i].className = ghosts[i].className.replaceAll(" hidden","");
        if (!keep){
            ghosts[i].className += " hidden";
        }
        else{
            for (var e = 0; e < evidence.length; e++){
                keep_evidence.add(evidence[e])
            }
        }
    }

    if (evi_array.length > 0){
        all_evidence.filter(evi => !keep_evidence.has(evi)).forEach(function(item){
            if (!not_evi_array.includes(item)){
                var checkbox = document.getElementById(item);
                $(checkbox).addClass("block")
                $(checkbox).find("#checkbox").removeClass(["good","bad"])
                $(checkbox).find("#checkbox").addClass(["neutral","block","disabled"])
                $(checkbox).find(".label").addClass("disabled-text")
                $(checkbox).find(".label").removeClass("strike")
            }
        })
    }

    setCookie("state",JSON.stringify(state),1)
    if (hasLink && !ignore_link){send_state()}
}

function showInfo(){

    if (!$("#blackout").is(":visible")){
        set_sparkle(false)
        initSparkling()
    }
    else{
        set_sparkle(true)
    }

    $("#blackout").fadeToggle(400)
}

function reset(skip_continue_session=false){
    if(!skip_continue_session){continue_session()}
    var uuid = getCookie("znid")
    state['settings'] = JSON.stringify(user_settings)
    fetch("https://zero-network.net/zn/"+uuid+"/end",{method:"POST",body:JSON.stringify(state),signal: AbortSignal.timeout(2000)})
    .then((response) => {
        setCookie("znid",uuid,-1)
        setCookie("state",JSON.stringify(state),-1)
        location.reload()
    })
    .catch((response) => {
        setCookie("znid",uuid,-1)
        setCookie("state",JSON.stringify(state),-1)
        location.reload()
    });
}

function showWiki(){
    if (document.getElementById("wiki_box").style.left == "-182px"){
		closeTabs()
		
        document.getElementById("wiki_box").style.boxShadow = "5px 0px 10px 0px #000"
        document.getElementById("wiki_tab").style.boxShadow = "-6px 5px 5px -2px #000"
        document.getElementById("wiki_box").style.zIndex= "1"
        document.getElementById("wiki_box").style.left = "196px"
    }
    else {
        closeTabs()
    }
}

function closeTabs() {
	document.getElementById("wiki_box").style.left = "-182px"
    document.getElementById("wiki_box").style.boxShadow = "none"
    document.getElementById("wiki_tab").style.boxShadow = "none"
	
	
}
