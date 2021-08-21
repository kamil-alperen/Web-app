let squares = document.getElementsByClassName("square")
let clickedSquare = {}
let suitableElements = []
let table = []
let turn = "white"

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
document.getElementById("html").onclick = (event) => {
    tableEl = document.querySelector(".table")
    targetParent = event.target.parentElement
    if(tableEl != targetParent){
        if(clickedSquare.element){
            clickedSquare.element.style.backgroundColor = clickedSquare.originalBackgroundColor
            restoreSuitableElements()
        }
    }
}

for(let i = 0;i < squares.length;i++){
    squares[i].onclick = () => {
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
    }
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
        suitableElements[i].element.onclick = function(){
            /*  getProperty, removeProperty, setProperty için css rule kullanılır */
            /* getAttribute, setAttribute, removeAttribute için style rule kullanılır */
            /* element'in property ve attribute'u ile style'ının propert, attribute'u farklı şeylerdir */
            /* document.styleSheets[0].cssRules[5].style.removeProperty("background-color") */
            clickedSquare.element.style.backgroundColor = clickedSquare.originalBackgroundColor
            suitableElements[i].element.style.backgroundImage = getComputedStyle(clickedSquare.element).backgroundImage
            clickedSquare.element.style.backgroundImage = "url('')"
            restoreTable(i)
            restoreSuitableElements()
            turn = turn === "white" ? "black" : "white"
            isGameOver()
            
        }
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
    for(let i = 0;i < squares.length;i++){
        squares[i].onclick = () => {    
            if(checkTurn(findPiece(squares[i]))){
                if(clickedSquare.element){
                    clickedSquare.element.style.backgroundColor = clickedSquare.originalBackgroundColor
                }
                clickedSquare = {
                    element : squares[i],
                    originalBackgroundColor : squares[i].originalBackgroundColor
                }
                squares[i].style.backgroundColor = "yellow"
                findAllCapabilities(squares[i])
            }
        }
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
    for(let i = 0;i < suitableElements.length;i++){
        oldSuitableElement = suitableElements[i].element
        oldSuitableElement.style.backgroundColor = suitableElements[i].oldBackgroundColor
    }
    suitableElements = []
    restoreOnclickEvents()
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
                        if(position_y+2 <= 8){
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
                        if(position_y-2 >= 1){
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