let optioncont = document.querySelector(".option-cont");
let toolcont = document.querySelector(".tools-cont");
let penciltoolcont = document.querySelector(".pencil-tool-cont");
let erasertoolcont = document.querySelector(".eraser-tool-cont");
let upload = document.querySelector(".upload");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let stickynote = document.querySelector(".stickynote");

let optionsFlag = true;
let pencilFlag = false;
let eraserFlag = false;


optioncont.addEventListener("click", (e) => {
    optionsFlag = !optionsFlag;
    console.log(optionsFlag);
    if (optionsFlag) {
        opentools();
    } else {
        closetools();
    }

})

function opentools() {
    let iconElem = optioncont.children[0];
    iconElem.classList.remove("fa-xmark");
    iconElem.classList.add("fa-bars");
    toolcont.style.display = "flex";

}
function closetools() {
    let iconElem = optioncont.children[0];
    iconElem.classList.remove("fa-bars");
    iconElem.classList.add("fa-xmark");
    toolcont.style.display = "none";

    penciltoolcont.style.display = "none";
    erasertoolcont.style.display = "none";
}

pencil.addEventListener("click", (e) => {
    //true-> show pencil tool, false-> hide pencil tool
    pencilFlag = !pencilFlag;
    if (pencilFlag) {
        penciltoolcont.style.display = "block"
    } else {
        penciltoolcont.style.display = "none"
    }

})

eraser.addEventListener("click", (e) => {
    //true-> show eraser tool, false-> hide eraser tool
    eraserFlag = !eraserFlag;
    if (eraserFlag) {
        erasertoolcont.style.display = "flex"
    } else {
        erasertoolcont.style.display = "none"
    }
})
upload.addEventListener("click", (e) => {
    // open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyTemplateHTML = `
        <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note">
        <img src="${url}"/>
        </div>
        `;
        createsticky(stickyTemplateHTML);
    })
})


stickynote.addEventListener("click", (e) => {
    let stickyTemplateHTML=`
    <div class="header">
        <div class="minimize"></div>
        <div class="remove"></div>
        </div>
        <div class="note">
        <textarea class="textarea-cont" spellcheck="false"></textarea>
        </div>
        `;
        createsticky(stickyTemplateHTML);
})

function createsticky(stickyTemplateHTML) {
    let stickycont = document.createElement("div");
    stickycont.setAttribute("class", "sticky-cont");
    stickycont.innerHTML = stickyTemplateHTML;
    let minimize = stickycont.querySelector(".minimize");
    let remove = stickycont.querySelector(".remove");
    noteActions(minimize, remove, stickycont);
     
    document.body.appendChild(stickycont);

    stickycont.onmousedown = function (event) {
        DragAndDrop(stickycont, event)
    };

    stickycont.ondragstart = function () {
        return false;
    };

}
function noteActions(minimize, remove, stickycont) {
    remove.addEventListener("click", (e) => {
        stickycont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let notecont = stickycont.querySelector(".note")
        let display = getComputedStyle(notecont).getPropertyValue("display");
        if (display === "none") {
            notecont.style.display = "block";
        } else {
            notecont.style.display = "none";
        }
    })

}

function DragAndDrop(element, event) {

    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the ball at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // drop the ball, remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}
