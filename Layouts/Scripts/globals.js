const cookieName = "demonologistCheatSheet"

const imagePath = "Layouts/Images/"

var all_evidence = [
    "ESG",
    "EMF 5",
    "Fingerprints",
    "Freezing",
    "Ectoplasm",
    "Easel",
    "Spirit Box"
]

var all_ghosts = [
    "Abaddon",
    "Agash",
    "Boogey",
    "Demon",
    "Deogen",
    "Goryo",
    "Guipo",
    "Gul",
    "Hantu",
    "Iblis",
    "Jinn",
    "Mare",
    "Myling",
    "Naamah",
    "Oni",
    "Onryo",
    "Poltergeist",
    "Raiju",
    "Revenant",
    "Shade",
    "Thaye",
    "Wraith",
    "Yokai",
    "Yurei"
]

var all_speed = [
    "Slow",
    "Normal",
    "Fast",
    "Variable",
    "Unknown"
]

// app state
var state = {
    "evidence": {},
    "speed": {
        "Slow": 0,
        "Normal": 0,
        "Fast": 0
    }, "ghosts": {}
}

// user settings
var user_settings = {
    
}

// list of pages
var pages = [
    "notebook",
    "guide"
]

// tab positions
var tabInLeft = "158px";
var tabOutLeft = "536px";