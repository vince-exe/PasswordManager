const addPwdBtn = document.getElementById('add-pwd')

const mainBox = document.getElementsByClassName('main-box')[0]

addPwdBtn.addEventListener('click', e => {
    window.location.replace("http://localhost:7550/views/add-pwd.html")
})

/* return the bigger multiply of the given number */
const calculateMultiply = (n, n1) => {
    if(n1 < n) { return -1 }

    for(let i = n1; i > 0; i--) {
        if(i % n == 0) {
            return i
        }
    }   

    return n1
}

const inputPwdFunc = (inputPwd, type, id, placeholder, maxLen, value) => {
    inputPwd.type = type
    inputPwd.id = id
    inputPwd.placeholder = placeholder
    inputPwd.maxLength = maxLen
    inputPwd.value = value
}

const textAreaFunc = (passArea, id, spellcheck, placeholder, maxLength, value) => {
    passArea.id = id
    passArea.spellcheck = spellcheck
    passArea.placeholder = placeholder
    passArea.maxLength = maxLength
    passArea.value = value
}

const printOnRange = (min, max, array) => {
    let boxDiv = document.createElement('div')
    boxDiv.classList.add('box')

    for(let i = min; i < max; i++) {
        let smallBox = document.createElement('div')
        smallBox.classList.add('small-box')

        let titleLabel = document.createElement('h1')
        titleLabel.textContent = "Title"
        titleLabel.id = "title-label"

        let inputPwd = document.createElement('input')
        inputPwdFunc(inputPwd, "text", "title-password", "password title", 20, array[i].title)

        let passArea = document.createElement('textarea')
        textAreaFunc(passArea, "pwd-box", false, "your password here", 35, "* * * * * * * * * *")

        let buttonsContainer = document.createElement('div')
        buttonsContainer.classList.add('buttons-container')

        let btnContainer1 = document.createElement('button')
        btnContainer1.classList.add('button-small-box')
        btnContainer1.textContent = "Remove"

        btnContainer1.addEventListener('click', e => {
            deletePassword(array[i].title)
        })

        let btnContainer2 = document.createElement('button')
        btnContainer2.classList.add('button-small-box')
        btnContainer2.textContent = "Update"

        let btnContainer3 = document.createElement('button')
        btnContainer3.classList.add('button-small-box')
        btnContainer3.textContent = "Show"

        let show = false
        btnContainer3.addEventListener('click', e => {
            if(!show) {
                passArea.value = array[i].pwd
                show = true
            }
            else {
                passArea.value = "* * * * * * * * * *"
                show = false
            }
        })

        /* buttons container */
        buttonsContainer.appendChild(btnContainer1)
        buttonsContainer.appendChild(btnContainer2)
        buttonsContainer.appendChild(btnContainer3)

        /* small box */
        smallBox.appendChild(titleLabel)
        smallBox.appendChild(inputPwd)
        smallBox.appendChild(passArea)
        smallBox.appendChild(buttonsContainer)

        boxDiv.appendChild(smallBox)
    }
    mainBox.appendChild(boxDiv)
}

const printOnSameRow= (n, max, array) => { 
    for(let i = n; i <= max; i += n) {

        let boxDiv = document.createElement('div')
        boxDiv.classList.add('box')

        for(let j = i - n, k = 0; k < n; k++, j++) {
            let smallBox = document.createElement('div')
            smallBox.classList.add('small-box')

            let titleLabel = document.createElement('h1')
            titleLabel.textContent = "Title"
            titleLabel.id = "title-label"

            let inputPwd = document.createElement('input')
            inputPwdFunc(inputPwd, "text", "title-password", "password title", 20, array[j].title)
    
            let passArea = document.createElement('textarea')
            textAreaFunc(passArea, "pwd-box", false, "your password here", 35, "* * * * * * * * * *")

            let buttonsContainer = document.createElement('div')
            buttonsContainer.classList.add('buttons-container')

            let btnContainer1 = document.createElement('button')
            btnContainer1.classList.add('button-small-box')
            btnContainer1.textContent = "Remove"
            
            btnContainer1.addEventListener('click', e => {
                deletePassword(array[j].title)
            })

            let btnContainer2 = document.createElement('button')
            btnContainer2.classList.add('button-small-box')
            btnContainer2.textContent = "Update"

            let btnContainer3 = document.createElement('button')
            btnContainer3.classList.add('button-small-box')
            btnContainer3.textContent = "Show"
            
            let show = false
            btnContainer3.addEventListener('click', e => {
                if(!show) {
                    passArea.value = array[j].pwd
                    show = true
                }
                else {
                    passArea.value = "* * * * * * * * * *"
                    show = false
                }
            })

            /* buttons container */
            buttonsContainer.appendChild(btnContainer1)
            buttonsContainer.appendChild(btnContainer2)
            buttonsContainer.appendChild(btnContainer3)

            /* small box */
            smallBox.appendChild(titleLabel)
            smallBox.appendChild(inputPwd)
            smallBox.appendChild(passArea)
            smallBox.appendChild(buttonsContainer)

            boxDiv.appendChild(smallBox)
        }
        mainBox.appendChild(boxDiv)
    }
}

/* print the passwords */
const printPasswords = () => {
    fetch('http://localhost:7550/api/v1/get-passwords').then(async response => {
        console.log("\nstatus response: " + response.status)
    
        if(response.status == 401) {
            window.location.replace('http://localhost:7550/views/index.html')
        }
    
        let array = JSON.parse(await response.text()).pwdList
    
        let max = calculateMultiply(4, array.length)
        if(max == -1) {
            return  printOnRange(0, array.length, array)
        }
    
        printOnSameRow(4, array.length, array)
    
        /* if there are more items to print */
        if((array.length - max) != 0) {
            return  printOnRange(max, array.length, array)
        }
    })
    .catch(error => {
        console.error(error)
    })
}

const deletePassword = (title) => {
    fetch('http://localhost:7550/api/v1/del-pwd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'title': title
        })

    }).then(async response => {
        console.log("\nstatus response: " + response.status)
    
        if(response.status == 401) {
            window.location.replace('http://localhost:7550/views/index.html')
        }
        
        if(response.status == 200) {
            window.location.replace('http://localhost:7550/views/homepage.html')
        }
    })
    .catch(error => {
        console.error(error)
    })
}

printPasswords()