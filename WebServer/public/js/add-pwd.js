const cancelBtn = document.getElementById('cancelBtn')

const confirmBtn = document.getElementById("confirmBtn")

const titlePwd = document.getElementById("title-password")

const msgPwd = document.getElementById("pwd-box")

const msgToDisplay = document.getElementById("msg-to-display")

const showMsgToDisplay = (msg) => {
    msgToDisplay.style.display = 'block'
    msgToDisplay.textContent = msg
}

cancelBtn.addEventListener('click', e => {
    window.location.replace('http://localhost:7550/views/homepage.html')
})

confirmBtn.addEventListener('click', e => {
    if (!titlePwd.value.length || !msgPwd.value.length) {
        return showMsgToDisplay("Title and message can't be empty")
    }

    fetch('http://localhost:7550/api/v1/add-pwd', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'title': titlePwd.value,
            'msg': msgPwd.value
        })
    })
    .then(response => {
        if (response.status == 500) {
            return showMsgToDisplay("The system failed to handle the registration method, please try later")
        }

        if (response.status == 200) {
            window.location.replace('http://localhost:7550/views/homepage.html')
        }

        if (response.status == 400) {
            showMsgToDisplay("There is already a password box with this title.")

            titlePwd.value = ""
            msgPwd.value = ""
        }
    })
    .catch(reason => {
        console.error(reason)
        return
    })
})