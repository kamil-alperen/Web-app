let page = 1
let saveLength = 0

let rows = document.getElementsByClassName("row")
let cols1 = document.getElementsByClassName("col1")
let cols2 = document.getElementsByClassName("col2")
let cols3 = document.getElementsByClassName("col3")
let cols4 = document.getElementsByClassName("col4")
let cols5 = document.getElementsByClassName("col5")
let playBtns = document.getElementsByClassName("playBtn")
let deleteBtns = document.getElementsByClassName("deleteBtn")
let prevIcon = document.querySelector(".fa-angle-double-left")
let nextIcon = document.querySelector(".fa-angle-double-right")

function getData(page, id){
    fetch(`/api/chessgame/saveInfo/${page}/${id}`)
    .then(response => response.json())
    .then(data => {
        saveLength = data[data.length - 1].saveLength
        console.log(data);
        for(let i = 0;i < data.length-1;i++) {
            rows[i].style.display = 'grid'
            playBtns[i].style.setProperty('display','inline-block')
            playBtns[i].value = 'PLAY'
            playBtns[i].recordId = data[i].id
            deleteBtns[i].style.setProperty('display','inline-block')
            deleteBtns[i].value = 'DELETE'
            deleteBtns[i].recordId = data[i].id
            cols1[i+1].textContent = data[i].fields_list.field1
            cols2[i+1].textContent = data[i].fields_list.field2
            cols3[i+1].textContent = data[i].fields_list.field3
            cols4[i+1].textContent = data[i].fields_list.field4
        }
        for(let i = data.length-1;i < 5;i++){
            rows[i].style.display = 'none'
            console.log('index : '+i);
            console.log(rows[i].style.display);
        }
    })
}
getData(page, 0)

for(let i = 0;i < deleteBtns.length;i++){
    deleteBtns[i].addEventListener('click', (e) => {
        data = {
            'id' : deleteBtns[i].recordId
        }
        fetch('/api/chessgame/saveTable', {
            method : 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
        .then(data => {
            getData(page, 0)
        })
    })
}

for(let i = 0;i < playBtns.length;i++){
    playBtns[i].addEventListener('click', (e) => {
        fetch(`/api/chessgame/saveInfo/0/${playBtns[i].recordId}`)
        .then(response => response.json())
        .then(data => {
            window.location.replace(data.url)
        })
    })
}

prevIcon.addEventListener('click', () => {
    if(page > 1){
        page -= 1
        getData(page, 0)
    }
})

nextIcon.addEventListener('click', () => {
    currentSaves = page * 5
    if(currentSaves < saveLength){
        page += 1
        getData(page, 0)
    }
})



