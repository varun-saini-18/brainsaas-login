// Linked with front.html file.

const loginBtn = document.querySelector('#login-btn');

loginBtn.onclick = function () {

    const usernameInput = document.querySelector('#username-input');
    const passwordInput = document.querySelector('#password-input');

    const username = usernameInput.value;
    const password = passwordInput.value;

    usernameInput.value="";
    passwordInput.value="";
    
    window.location.href = "http://localhost:5000";
    
//     fetch('http://localhost:3000/users/login', {
//         headers: {
//             'Content-type': 'application/json',
//         },
//         method: 'POST',
//        body: JSON.stringify({ username: username, password: password})
//     })
//     .then(response => response.json())
//     .then(data =>{
//         if(data.token)
//         {
//         var tok='Bearer '+data.token
//         window.localStorage.setItem('access_token', tok)
//         alert('Logged In the user successfully!')
//         }
//         else
//         alert('Either username or password is wrong!')
//     })
//     .catch(err=>{
//         alert(err);
//     });
}

