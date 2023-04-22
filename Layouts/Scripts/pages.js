function loadPages() {
    for (var i = 0; i < pages.length; i++) {
        var thisPage = pages[i];
        var thisUri = "pages/" + thisPage + ".html"
        var targetBody = "#" + pages[i] + "-body";

        $(targetBody).load(thisUri)
    }
}

function showTab(tabName) {
    var targetBox = tabName + "_box"
    var targetTab = tabName + "_tab"

    if (document.getElementById(targetBox).style.left == "-182px") {
        closeTabs()

        document.getElementById(targetBox).style.boxShadow = "5px 0px 10px 0px #000"
        document.getElementById(targetTab).style.boxShadow = "-6px 5px 5px -2px #000"
        document.getElementById(targetTab).style.left = tabOutLeft;
        document.getElementById(targetBox).style.left = "196px"
    } else {
        closeTabs()
    }
}

function closeTabs() {
    for (var i = 0; i < pages.length; i++) {
        var targetBox = pages[i] + "_box"
        var targetTab = pages[i] + "_tab"

        document.getElementById(targetBox).style.left = "-182px"
        document.getElementById(targetBox).style.boxShadow = "none"
        document.getElementById(targetTab).style.boxShadow = "none"
        document.getElementById(targetTab).style.left = tabInLeft;
    }

}