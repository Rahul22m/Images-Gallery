<script>
    import {token, loginToken, isAuthenticated } from './authStore';
    import axios from 'axios';

    let email='';
    let password='';

    import { navigate } from 'svelte-routing';
 

    const LOGIN_USER_MUTATION = `
        mutation login($email: String!, $password: String!){
            login(email: $email, password: $password){
                token
            }
        }`

    const login = async() =>{
        try{
            const result  = await axios({
                url: 'http://localhost:4000/graphql',
                method: 'POST',
                data: {
                    "query": LOGIN_USER_MUTATION,
                    "variables": {
                        email,
                        password
                    }
                }
            });

            console.log('Login Response:', result);
            const newToken = result.data.data.login.token;
            loginToken(newToken);
            alert('Login successful');
            if(isAuthenticated){
                navigate("/images");
            }
        }
        catch (error) {
            if (error.response) {
                const data = error.response.data;
                console.error('Error Response Data:', data); 
                alert(`Error: ${data.message || 'An error occurred'}`); 
            } else if (error.request) {
                alert('No response received from the server.');
                console.error('No response received:', error.request);
            } else {
                alert('Failed to login.');
                console.error('Error setting up request:', error.message);
            }
        }
    }
</script>


<body>
    <div class="form-container">
        <h2>Login</h2>
        <form on:submit|preventDefault={login}>
            <div class="form-group">
                <label for="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email" 
                    placeholder="Enter your email"
                    required
                    autocomplete="off"
                    bind:value={email}  
                />
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"  
                    placeholder="Password"
                    required
                    bind:value={password} 
                />
            </div>
            <button type="submit" class="submit-btn">Login</button>
        </form>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
    </div>
</body>

<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
    }

    h2 {
        text-align: center;
        margin-bottom: 30px;
    }

    .form-container {
        width: 300px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    .form-group input {
        width: 100%;
        padding: 8px;
        font-size: 14px;  
        border: 1px solid #ccc;
        border-radius: 3px;
    }

    .submit-btn {
        display: block;
        width: 100%;
        padding: 10px;
        background-color: #472dbb;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .submit-btn:hover {
        background-color: #4565a0;
    }

    p {
        margin-top: 15px;
    }
</style>
