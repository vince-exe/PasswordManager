const addPwdBtn = document.getElementById('add-pwd')

addPwdBtn.addEventListener('click', e => {
    window.location.replace("http://localhost:7550/views/add-pwd.html")
})

/* print the passwords */
fetch('http://localhost:7550/api/v1/get-passwords').then(async response => {
    console.log("\nstatus response: " + response.status)
    console.log(JSON.parse(await response.text()).pwdList)
})
.then(error => {
    console.error(error)
})