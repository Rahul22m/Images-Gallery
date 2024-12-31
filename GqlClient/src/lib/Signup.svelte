<script>
  
    import axios from 'axios';
    import {navigate} from 'svelte-routing';


    const CREATE_USER_MUTATION = `
        mutation createAnUser($user: AddUserInput!) {
            createUser(user: $user) {
                data{
                    userType
                    id
                    email
                }
            }
        }`;
    
    let userType = "User";
    let email = "";
    let password = "";
    let confirmPassword = "";
    let errorMessage = "";
    let successMessage = "";

    function validatePassword(password) {
        const minLength = 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasDigit = /\d/.test(password);

        return password.length >= minLength && hasUppercase && hasLowercase && hasDigit;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    

    async function signup(event) {

        errorMessage = "";
        successMessage = "";

        if (!email || !password || !confirmPassword) {
            errorMessage = 'All fields are required.';
            return;
        }

        const isValid = emailPattern.test(email);

        if(!isValid){
            errorMessage = 'Please provide a valid email id';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            return;
        }

        if (!validatePassword(password)) {
            errorMessage = 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.';
            return;
        }

        try {
            await axios({
                url: 'http://localhost:4000/graphql',
                method: "POST",
                data:{
                    "query": CREATE_USER_MUTATION,
                    "variables": {
                        user: {
                            userType,
                            email,
                            password,
                            confirmPassword
                        },
                }    
            },
      });

            setTimeout(() => {
                navigate("/login");
            }, 1000); 
        } catch (error) {
            if (error.response) {
                errorMessage = error.response.data.message.errors[0].message || 'Signup failed. Please try again.';
            } else if (error.request) {
                errorMessage = 'No response received from the server.';
            } else {
                errorMessage = 'Signup failed. Please try again.';
            }
            console.log(error);
        }
    }
</script>


<body>
    <div class="form-container">
        <h2>Sign Up</h2>
        <form on:submit|preventDefault={signup}>
            <div class="form-group">
            </div>
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
                    title="Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number."
                    required
                    bind:value={password}
                />
            </div>
            <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    title="Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one number."
                    required
                    bind:value={confirmPassword}
                />
            </div>
            <div id="password-message">
                <h3>Password must contain:</h3>
                <p class="password-message-item">
                    At least
                    <b>one lowercase letter</b>
                </p>
                <p class="password-message-item">
                    At least
                    <b>one uppercase letter</b>
                </p>
                <p class="password-message-item">
                    At least
                    <b>one number</b>
                </p>
                <p class="password-message-item">
                    Minimum
                    <b>8 characters</b>
                </p>
            </div>
            <button type="submit" class="submit-btn">Sign Up</button>
            {#if errorMessage}
                <p class="error-message">{errorMessage}</p>
            {/if}
            {#if successMessage}
                <p class="success-message">{successMessage}</p>
            {/if}
        </form>
        <p>Already have an account? <a href="/login">Login</a></p>
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

    .error-message, .success-message {
        color: #d9534f;
        font-size: 14px;
        text-align: center;
        margin-top: 15px;
    }

    .success-message {
        color: #5bc0de; 
    }

    #password-message {
        display: block;
        background: #ffffff;
        color: #000;
        position: relative;
        padding: 20px;
        margin-top: 10px;
        text-align: left;
        border: 1px solid #ccc;
        border-radius: 5px;
    }

    #password-message h3 {
        font-size: 15px;
        margin-top: 0;
        text-transform: uppercase;
    }

    #password-message p {
        margin: 8px 0;
    }
</style>
