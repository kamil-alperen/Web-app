let squares = document.getElementsByClassName("square")
let clickedSquare = {}
let suitableElements = []
let table = []
let turn = "white"
for(let i = 0;i < 8;i++){
    num1 = i + 1 + 8
    num2 = i + 1 + 48
    squares[num1].moved = false
    squares[num2].moved = false
}
function fillTable(){
    row1 = ["black_castle1","black_horse1","black_elephant1","black_queen1","black_king1","black_elephant2","black_horse2","black_castle2"]
    row8 = ["white_castle1","white_horse1","white_elephant1","white_queen1","white_king1","white_elephant2","white_horse2","white_castle2"]
    row2 = []
    row7 = []
    for(let i = 0;i < 8;i++){
        row2.push("black_pawn"+i)
        row7.push("white_pawn"+i)
        
    }
    table.push(row1)
    table.push(row2)
    for(let i = 0;i < 4;i++){
        empty_row = []
        for(let j = 0;j < 8;j++){
            empty_row.push("")
        }
        table.push(empty_row)
    }
    table.push(row7)
    table.push(row8)
    for(let i = 0;i < squares.length;i++){
        squares[i].originalBackgroundColor = getComputedStyle(squares[i]).backgroundColor
    }
}
fillTable()


expandToLeft_element = document.querySelector(".left-expand")
rightSideBar_element = document.querySelector(".side-bar")
saveGame_element = document.querySelector(".save-game")
newGame_element = document.querySelector(".new-game")
expandToLeft_element.addEventListener("mouseenter", (e) => {
    el = rightSideBar_element
    el.style.backgroundColor = "black"
    el.style.width = "10%"
    saveGame_element.style.setProperty("display","inline-block")
    newGame_element.style.setProperty("display","inline-block")
    expandToLeft_element.style.transform = "rotateY(180deg)"
})
rightSideBar_element.addEventListener("mouseleave", (e) => {
    el = rightSideBar_element
    el.style.removeProperty('background-color')
    el.style.setProperty('width','3%')
    saveGame_element.style.setProperty("display","none")
    newGame_element.style.setProperty("display","none")
    expandToLeft_element.style.removeProperty('transform')
})

finishGame_element = document.querySelector(".finish-game")
settings_element = document.querySelector(".settings")
saved_element = document.querySelector(".save-game")
popUpFinish = document.querySelector(".pop-up-finish-game")
popUpSettings = document.querySelector(".pop-up-settings")
popUpSaved = document.querySelector(".pop-up-saved")
popUpTop = document.querySelector(".pop-up-top")
clearBtn = document.querySelector("#clearbtn")
submitBtn = document.querySelector("#submitbtn")
field1 = document.querySelector("#player1")
field2 = document.querySelector("#player2")
field3 = document.querySelector("#gamename")
field4 = document.querySelector("#descr")
popUpSuccess = document.querySelector('.pop-up-success')

clearBtn.addEventListener('click', (e) => {
    field1.value = ''
    field2.value = ''
    field3.value = ''
    field4.value = ''
})
submitBtn.addEventListener('click',(e) => {
    if(field3.value === ''){
        field3.style.setProperty('border','5px solid red')
    }
    else {
        fetch('/api/chessgame/table',{
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify(table)
        }).then(response => response.json())
        .then(data => console.log(data))
        popUpSaved.style.display = 'none'
        popUpSuccess.textContent = 'Game is saved successfully'
        popUpSuccess.style.display = 'block'
        e.stopPropagation()
    }
})
settings_element.addEventListener('click', (e) => {
    popUpSettings.style.display = 'block'
    popUpTop.style.setProperty('text-align','center')
    popUpTop.textContent = 'Settings'
    popUpTop.style.setProperty('padding-top','0.2em')
    popUpSettings.appendChild(popUpTop)
    e.stopPropagation()
})

saved_element.addEventListener('click', (e) => {
    popUpSaved.style.display = 'block'
    popUpTop.style.setProperty('text-align','center')
    popUpTop.textContent = 'Save Game'
    popUpTop.style.setProperty('padding-top','0.2em')
    popUpSaved.appendChild(popUpTop)
    e.stopPropagation()
})

finishGame_element.addEventListener("click", (e) => {
    black_points = 0
    white_points = 0
    for(let i = 0;i < table.length;i++){
        for(let j = 0;j < table[0].length;j++){
            piece = table[i][j]
            color = piece.substring(0, piece.indexOf("_"))
            namePiece = piece.substring(piece.indexOf("_")+1, piece.length-1)
            if(color === "black"){
                switch(namePiece){
                    case "pawn":
                        black_points+=1
                        break
                    case "queen":
                        black_points+=5
                        break
                    case "king":
                        black_points+=7
                        break
                    default:
                        black_points+=3
                }
            }   
            else if(color === "white"){
                switch(namePiece){
                    case "pawn":
                        white_points+=1
                        break
                    case "queen":
                        white_points+=5
                        break
                    case "king":
                        white_points+=7
                        break
                    default:
                        white_points+=3
                }
            }   
        }
    }
    winner = black_points === white_points ? "Draw" : black_points > white_points ? "Black" : "White"
    popUpFinish.style.display = "block"
    
    popUpFinish.innerHTML = `Black Points : ${black_points}/38 <br>White Points : ${white_points}/38 <br>Winner : ${winner}`;
    popUpFinish.style.setProperty('text-align','center')
    popUpTop.textContent = 'Score Table'
    popUpTop.style.setProperty('text-align','center')
    popUpTop.style.setProperty('padding-top','0.2em')
    popUpFinish.appendChild(popUpTop);
    e.stopPropagation()
})

document.getElementById("html").onclick = (event) => {
    tableEl = document.querySelector(".table")
    targetParent = event.target.parentElement
    if(tableEl != targetParent){
        if(clickedSquare.element){
            clickedSquare.element.style.backgroundColor = clickedSquare.originalBackgroundColor
            restoreSuitableElements()
        }
    }
    par_par = event.target.parentElement.parentElement
    par_par_par = par_par.parentElement
    if(event.target !== popUpFinish && event.target !== popUpTop){
        popUpFinish.style.display = "none"
    }
    if(par_par !== popUpSettings && event.target !== popUpTop && par_par_par !== popUpSettings){
        popUpSettings.style.display = "none"
    }
    if(par_par !== popUpSaved && event.target !== popUpTop && par_par_par !== popUpSaved){
        popUpSaved.style.display = "none"
    }
    if(event.target !== popUpSuccess){
        popUpSuccess.style.display = "none"
        if(popUpSaved.style.display === 'none'){
            field3.style.setProperty('border','')
            field1.value = ''
            field2.value = ''
            field3.value = ''
            field4.value = ''
        }
    }
}

for(let i = 0;i < squares.length;i++){
    squares[i].addEventListener("click", squares[i].firstClickEvent = () => {
        if(checkTurn(findPiece(squares[i]))){ 
            if(clickedSquare.element){
                clickedSquare.element.style.backgroundColor = clickedSquare.originalBackgroundColor
            }
            clickedSquare = {
                element : squares[i],
                originalBackgroundColor : squares[i].originalBackgroundColor
            }
            squares[i].style.backgroundColor = "yellow"
            if(suitableElements.find(arrEl => arrEl.element === squares[i])){
                suitableElements.find(arrEl => arrEl.element === squares[i]).oldBackgroundColor = "yellow"
            }
            findAllCapabilities(squares[i])
        }
    })
}

function findAllCapabilities(squareElement){
    restoreSuitableElements()
    let [color, name, position_x, position_y] = findPiece(squareElement)
    const moveFunction = determineMoveFunction(color, name)
    if(moveFunction){
        allMoves = moveFunction(position_x, position_y)
        allCapabilities = []
        for(let i = 0;i < allMoves.length;i++){
            position_x = allMoves[i][0]
            position_y = allMoves[i][1]
            strPiece = table[position_y-1][position_x-1]
            suitableAreaColor = strPiece.substring(0,strPiece.indexOf("_"))
            if(suitableAreaColor !== color){
                allCapabilities.push(allMoves[i])
            }
        }
        for(let i = 0;i < allCapabilities.length;i++){
            pieceLocation = allCapabilities[i]
            htmlLoc_x = pieceLocation[0]
            htmlLoc_y = pieceLocation[1]
            divClassNumber = (htmlLoc_y - 1) * 8 + htmlLoc_x
            suitableElement = document.querySelector(`.square${divClassNumber}`)
            oldSuitableElement = {
                element : suitableElement,
                oldBackgroundColor : suitableElement.originalBackgroundColor,
                table_position_x : htmlLoc_x - 1,
                table_position_y : htmlLoc_y - 1
            }
            suitableElements.push(oldSuitableElement)
            suitableElement.style.backgroundColor = "rgb(26, 235, 19)"
        }
        movePiece()
    }
}
function movePiece(){
    for(let i = 0;i < suitableElements.length;i++){
        suitableElements[i].element.removeEventListener("click", suitableElements[i].element.firstClickEvent);
        suitableElements[i].element.addEventListener("click", suitableElements[i].element.secondClickEvent = () => {
            /*  getProperty, removeProperty, setProperty style için geçerlidir ve css rule kullanılır => sadece inline'daki style'a etki eder */
            /* getAttribute, setAttribute, removeAttribute element attribute'ları için geçerlidir */
            /* document.styleSheets[i].cssRules[j].style.removeProperty("background-color")*/
            suitableElements[i].element.moved = true
            clickedSquare.element.style.backgroundColor = clickedSquare.originalBackgroundColor
            suitableElements[i].element.style.backgroundImage = getComputedStyle(clickedSquare.element).backgroundImage
            clickedSquare.element.style.backgroundImage = "url('')"
            restoreTable(i)
            restoreSuitableElements()
            turn = turn === "white" ? "black" : "white"
            isGameOver()
            
            
        });
    }
    
}
function isGameOver(){
    white_king = "white_king1"
    black_king = "black_king1"
    white_win = true
    black_win = true
    for(let i = 0;i < table.length;i++){
        for(let j = 0;j < table[0].length;j++){
            if(table[i][j] === white_king){
                black_win = false
            }
            else if(table[i][j] === black_king){
                white_win = false
            }
        }
    }
    if(white_win || black_win){
        if(white_win){
            console.log("WHITE WIN");
        }
        else {
            console.log("BLACK WIN");
        }
        turn = "GAME OVER"
    }
}
function restoreOnclickEvents(){
    for(let object of suitableElements){
        object.element.removeEventListener("click", object.element.secondClickEvent);
        object.element.addEventListener("click", object.element.firstClickEvent);
        
    }
}
function restoreTable(index){
    old_className = clickedSquare.element.className
    old_classNumber = parseInt(old_className.substring(6))
    old_position_x = old_classNumber % 8 === 0 ? 7 : old_classNumber % 8 - 1
    old_position_y = Math.ceil(old_classNumber / 8) - 1
    piece = table[old_position_y][old_position_x]
    table[old_position_y][old_position_x] = ""

    new_position_x = suitableElements[index].table_position_x
    new_position_y = suitableElements[index].table_position_y
    table[new_position_y][new_position_x] = piece

}
function restoreSuitableElements(){
    restoreOnclickEvents()
    for(let i = 0;i < suitableElements.length;i++){
        oldSuitableElement = suitableElements[i].element
        oldSuitableElement.style.backgroundColor = suitableElements[i].oldBackgroundColor
    }
    suitableElements = []
    
}
function findPiece(squareElement){
    className = squareElement.className
    firstClass = className.substring(0, className.indexOf(" "))
    firstClassNumber = firstClass.substring(6)
    position_y = Math.ceil(firstClassNumber / 8)
    position_x = firstClassNumber % 8 === 0 ? 8 : firstClassNumber % 8
    let piece = table[position_y-1][position_x-1]
    let color = piece.substring(0,piece.indexOf("_"))
    let name = piece.substring(piece.indexOf("_")+1)
    return [color, name, position_x, position_y]
    
}
function findElement(position_x, position_y){
    let squareNumber = position_x + (position_y-1) * 8
    if(squares[squareNumber].moved == false){
        return true
    }
    else {
        return false
    }
}
function determineMoveFunction(color, name){
    name = name.substring(0, name.length-1)
    if(name === "castle"){
        return function(position_x, position_y){
            allMoves = []
            for(let i = position_y+1;i <= 8;i++){
                pieceStr = table[i-1][position_x-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([position_x,i])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([position_x,i])
            }
            for(let i = position_y-1;i >= 1;i--){
                pieceStr = table[i-1][position_x-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([position_x,i])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([position_x,i])
            }
            for(let i = position_x+1;i <= 8;i++){
                pieceStr = table[position_y-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,position_y])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i, position_y])
            }
            for(let i = position_x-1;i >= 1;i--){
                pieceStr = table[position_y-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,position_y])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i, position_y])
            }
            return allMoves
        }
    }
    else if(name === "horse"){
        return function(position_x, position_y){
            allMoves = []
            if(position_x+1 <= 8 && position_y-2 >= 1){
                allMoves.push([position_x+1,position_y-2])
            }
            if(position_x+2 <= 8 && position_y-1 >= 1){
                allMoves.push([position_x+2,position_y-1])
            }
            if(position_x-1 >= 1 && position_y-2 >= 1){
                allMoves.push([position_x-1,position_y-2])
            }
            if(position_x-2 >= 1 && position_y-1 >= 1){
                allMoves.push([position_x-2,position_y-1])
            }
            if(position_x+2 <= 8 && position_y+1 <= 8){
                allMoves.push([position_x+2,position_y+1])
            }
            if(position_x+1 <= 8 && position_y+2 <= 8){
                allMoves.push([position_x+1,position_y+2])
            }
            if(position_x-2 >= 1 && position_y+1 <= 8){
                allMoves.push([position_x-2,position_y+1])
            }
            if(position_x-1 >= 1 && position_y+2 <= 8){
                allMoves.push([position_x-1, position_y+2])
            }
            return allMoves
        }
    }
    else if(name === "elephant"){
        return function(position_x, position_y){
            allMoves = []
            for(let i = position_x+1, j = position_y+1;i <= 8 && j <= 8;i++, j++){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            for(let i = position_x+1, j = position_y-1;i <= 8 && j >= 1;i++, j--){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            for(let i = position_x-1, j = position_y+1;i >= 1 && j <= 8;i--, j++){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            for(let i = position_x-1, j = position_y-1;i >= 1 && j >= 1;i--, j--){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            return allMoves
        }
        
    }
    else if(name === "queen"){
        return function(position_x, position_y){
            allMoves = []
            for(let i = position_y+1;i <= 8;i++){
                pieceStr = table[i-1][position_x-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([position_x,i])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([position_x,i])
            }
            for(let i = position_y-1;i >= 1;i--){
                pieceStr = table[i-1][position_x-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([position_x,i])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([position_x,i])
            }
            for(let i = position_x+1;i <= 8;i++){
                pieceStr = table[position_y-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,position_y])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i, position_y])
            }
            for(let i = position_x-1;i >= 1;i--){
                pieceStr = table[position_y-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,position_y])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i, position_y])
            }
            for(let i = position_x+1, j = position_y+1;i <= 8 && j <= 8;i++, j++){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            for(let i = position_x+1, j = position_y-1;i <= 8 && j >= 1;i++, j--){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            for(let i = position_x-1, j = position_y+1;i >= 1 && j <= 8;i--, j++){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            for(let i = position_x-1, j = position_y-1;i >= 1 && j >= 1;i--, j--){
                pieceStr = table[j-1][i-1]
                pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                if(pieceColor !== "" && pieceColor !== color){
                    allMoves.push([i,j])
                    break
                }
                if(pieceColor === color){
                    break
                }
                allMoves.push([i,j])
            }
            return allMoves
        }
    }
    else if(name === "king"){
        return function(position_x, position_y){
            allMoves = []
            if(position_x+1 <= 8){
                allMoves.push([position_x+1, position_y])
            }
            if(position_x-1 >= 1){
                allMoves.push([position_x-1, position_y])
            }
            if(position_y+1 <= 8){
                allMoves.push([position_x, position_y+1])
            }
            if(position_y-1 >= 1){
                allMoves.push([position_x, position_y-1])
            }
            if(position_x+1 <= 8 && position_y+1 <= 8){
                allMoves.push([position_x+1, position_y+1])
            }
            if(position_x-1 >= 1 && position_y+1 <= 8){
                allMoves.push([position_x-1, position_y+1])
            }
            if(position_x+1 <= 8 && position_y-1 >= 1){
                allMoves.push([position_x+1, position_y-1])
            }
            if(position_x-1 >= 1 && position_y-1 >= 1){
                allMoves.push([position_x-1, position_y-1])
            }
            return allMoves
        }
    }
    else if(name === "pawn"){
        if(color === "black"){
            return function(position_x, position_y){
                allMoves = []
                if(position_y+1 <= 8){
                    pieceStr = table[position_y][position_x-1]
                    pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                    if(pieceColor === ""){
                        allMoves.push([position_x,position_y+1])
                        if(position_y+2 <= 8 && findElement(position_x, position_y)){
                            pieceStr = table[position_y+1][position_x-1]
                            pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                            if(pieceColor === ""){
                                allMoves.push([position_x,position_y+2])
                            }
                        }
                    }
                }
                if(position_y+1 <= 8 && position_x-1 >= 1){
                    strPiece = table[position_y][position_x-2]
                    color = strPiece.substring(0,strPiece.indexOf("_"))
                    if(color === "white"){
                        allMoves.push([position_x-1, position_y+1])
                    }
                }
                if(position_y+1 <= 8 && position_x+1 <= 8){
                    strPiece = table[position_y][position_x]
                    color = strPiece.substring(0,strPiece.indexOf("_"))
                    if(color === "white"){
                        allMoves.push([position_x+1, position_y+1])
                    }
                }
                return allMoves
            }
        }
        else {  
            return function(position_x, position_y){
                allMoves = []
                if(position_y-1 >= 1){
                    pieceStr = table[position_y-2][position_x-1]
                    pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                    if(pieceColor === ""){
                        allMoves.push([position_x,position_y-1])
                        if(position_y-2 >= 1 && findElement(position_x, position_y)){
                            pieceStr = table[position_y-3][position_x-1]
                            pieceColor = pieceStr.substring(0,pieceStr.indexOf("_"))
                            if(pieceColor === ""){
                                allMoves.push([position_x,position_y-2])
                            }
                        }
                    }
                }
                
                if(position_y-1 >= 1 && position_x-1 >= 1){
                    strPiece = table[position_y-2][position_x-2]
                    color = strPiece.substring(0,strPiece.indexOf("_"))
                    if(color === "black"){
                        allMoves.push([position_x-1, position_y-1])
                    }
                }
                if(position_y-1 >= 1 && position_x+1 <= 8){
                    strPiece = table[position_y-2][position_x]
                    color = strPiece.substring(0,strPiece.indexOf("_"))
                    if(color === "black"){
                        allMoves.push([position_x+1, position_y-1])
                    }
                }
                return allMoves
            }
        }
    }
    else {
        return null
    }
}
function checkTurn(arr){
    [color, , , ] = arr
    if(color === turn || !color){
        return true
    }
    else {
        return false
    }
}