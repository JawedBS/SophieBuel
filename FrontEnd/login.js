const email = document.getElementById("email")
const password = document.getElementById("password")
const form = document.querySelector("form")
const errorText = document.getElementById("errortext")
 async function connection(email, password) {
    return fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })
}
 

form.addEventListener("submit", (event) => {
    event.preventDefault()
    const valueEmail = email.value
    const valuePassword = password.value
    connection(valueEmail, valuePassword)
    .then((response) => response.json())
    .then(login => { 
        if (login.token) {
            localStorage.setItem("token", login.token)
            window.location.href="./index.html"
        } else {
            errorText.classList.remove("hidden")
        }
    }) 
    
})
