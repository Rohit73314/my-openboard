let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let pencilcolor = document.querySelectorAll(".pencil-color");
let pencilwidthEle = document.querySelector(".pencil-width");
let eraserwidthEle = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let undo=document.querySelector(".undo");
let redo=document.querySelector(".redo");

let pencolor = "red";
let erasercolor = "white";
let penwidth = pencilwidthEle.value;
let eraserwidth = eraserwidthEle.value;


let mousedown = false;

let UndoRedotracker=[];//data
let track=0;// represent which action from tracker


//API
let tool = canvas.getContext("2d");

tool.strokeStyle = pencolor;
tool.lineWidth = penwidth;

//mousedown-> start new path,   mousemove-> path fill(graphics)
canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data={
       x:e.clientX,
       y:e.clientY
    }
    socket.emit("beginpath",data)
})
canvas.addEventListener("mousemove", (e) => {
    
    if (mousedown) {
        let data={
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? erasercolor : pencolor,
            width: eraserFlag ? eraserwidth : penwidth
        }
        // draWstroke(data);
        socket.emit("drawstroke",data)
    }
   
})
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url=canvas.toDataURL();
    UndoRedotracker.push(url);
    track=UndoRedotracker.length-1
})


undo.addEventListener("click",(e)=>{
    if(track>0){
        track--;
    }
    // track action
    let data={
        trackValue:track,
        UndoRedotracker 
      }
    
    // UndoRedocanvas(data)
    socket.emit("redoundo",data);

})
redo.addEventListener("click",(e)=>{
   if(track< UndoRedotracker.length-1){
    track++;
   }
   //track action
  let data={
    trackValue:track,
    UndoRedotracker 
  }

//  UndoRedocanvas(data);
 socket.emit("redoundo",data);
})
function UndoRedocanvas(trackObj){
    track=trackObj.trackValue;
    UndoRedotracker=trackObj.UndoRedotracker;
    let url=UndoRedotracker[track];
    
    let img=new Image();// new image reference element
    img.src=url;
    img.onload=(e)=>{
        tool.clearRect(0,0,canvas.width,canvas.height)
         tool.drawImage(img,0,0, canvas.width,canvas.height);
    }

}

function beginPath(strokeobj) {
    tool.beginPath();
    tool.moveTo(strokeobj.x, strokeobj.y);
}
function draWstroke(strokeobj) {
    tool.strokeStyle = strokeobj.color;
    tool.lineWidth = strokeobj.width;
    tool.lineTo(strokeobj.x, strokeobj.y);
    tool.stroke();
}



pencilcolor.forEach((colorElem) => {
    colorElem.addEventListener("click", (e) => {
        let color = colorElem.classList[0];
        pencolor = color;
        tool.strokeStyle = pencolor;
    })
})
pencilwidthEle.addEventListener("change", (e) => {
    penwidth = pencilwidthEle.value;
    tool.lineWidth = penwidth;
})

eraserwidthEle.addEventListener("change", (e) => {
    eraserwidth = eraserwidthEle.value;
    tool.lineWidth = eraserwidth;

})
eraser.addEventListener("click", (e) => {
    if (eraserFlag) {
        tool.strokeStyle = erasercolor;
        tool.lineWidth = eraserwidth;
    } else {
        tool.strokeStyle = pencolor;
        tool.lineWidth = penwidth;
    }

})

download.addEventListener("click", (e) => {
    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})


socket.on("beginpath",(data)=>{
    //data-> data from server
    beginPath(data);
})
socket.on("drawstroke",(data)=>{
    //data-> data from server
    draWstroke(data);
})
socket.on("redoundo",(data)=>{
    //data-> data from server
    UndoRedocanvas(data);
})
