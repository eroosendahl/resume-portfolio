let jqn = document.getElementById("jqn");       //https://www.geeksforgeeks.org/different-ways-to-access-html-elements-using-javascript/#:~:text=Users%20can%20use%20getElementById(),document.
let jqnContent = document.getElementById('jqnContent');
let presImages = document.getElementsByClassName("presImg");
let navLocs = document.getElementsByClassName("navLoc");
let curIndex = 0;
let nextIndex = 1;
let defaultBehavior = true;


jqn.addEventListener('mouseover', function handleMouseOver() {  //https://stackoverflow.com/questions/8318591/javascript-addeventlistener-using-to-create-a-mouseover-effect
    jqnContent.style.width = "100px";
});

jqn.addEventListener('mouseout', function handleMouseOut() {
    jqnContent.style.width = "0px";
});

function toggleNavLoc(index) {
    navLocs[index].classList.toggle("active");
}

function navViaArrow() {
    presImages[curIndex].classList.toggle("active");
    toggleNavLoc(curIndex);

    if (this.classList.contains('right')) {
        curIndex++;
        if (curIndex == presImages.length) {
            curIndex = 0;
        }
    }
    else {
        curIndex--;
        if (curIndex < 0) {
            curIndex = presImages.length-1;
        }
    }

    presImages[curIndex].classList.toggle("active");
    toggleNavLoc(curIndex);
    clearInterval(rotateImagesIntervalID);
};

document.querySelectorAll('.navArrow').forEach(b => {
    b.addEventListener('click', navViaArrow);
});

function rotateFlagshipImages() {
    presImages[curIndex].classList.toggle("active");
    presImages[nextIndex].classList.toggle("active");
    toggleNavLoc(curIndex);
    toggleNavLoc(nextIndex);

    curIndex++;
    nextIndex++;

    if (curIndex == presImages.length) {
        curIndex = 0;
    }
    if (nextIndex == presImages.length) {
        nextIndex = 0;
    }
}

function imgNav(navIndex) {
    presImages[curIndex].classList.toggle("active");
    presImages[navIndex].classList.toggle("active");
    toggleNavLoc(curIndex);
    toggleNavLoc(navIndex);
    clearInterval(rotateImagesIntervalID);
}

if (defaultBehavior) {
    var rotateImagesIntervalID = setInterval(rotateFlagshipImages, 3000);
}