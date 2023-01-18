const signUpBtn = document.getElementById("signupBtn")

const passwordInput = document.getElementById('masterKey')

const passwordInputConfirm = document.getElementById('masterKeyConfirm')

const msgToDisplay = document.getElementById('msg-to-display')

const titleApplication = document.getElementById('title-application')


const showMsgToDisplay = (msg) => {
    msgToDisplay.style.display = 'block'
    msgToDisplay.textContent = msg
    titleApplication.style.paddingBottom = "0px"
}

signUpBtn.addEventListener('click', ev => {
    if(passwordInput.value.length < 10) { 
        return showMsgToDisplay("Warning: password must be at least of 10 characters length")
    }
    
    if(passwordInputConfirm.value != passwordInput.value) {
        return showMsgToDisplay("Warning: passwords don't match.")
    }

    fetch('http://localhost:7550/api/v1/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'password': passwordInput.value
        })
    })
    .then(response => {
        if(response.status == 500) {
            return showMsgToDisplay("The system failed to handle the registration method, please try later")
        }

        if(response.status == 200) {
            showMsgToDisplay("Successfully registered, please login to use the application.")

            passwordInput.value = ""
            passwordInputConfirm.value = ""
        }
    })
    .catch(reason => {
        console.error(reason)
        return
    })
})