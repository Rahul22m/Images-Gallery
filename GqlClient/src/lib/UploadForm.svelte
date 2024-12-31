<script>
	import axios from "axios";

    export let file=null;
    export let title;
    export let description;
    export let imageUri;
	

    let errorMessage;


    export let toggleForm = () => {};

    export let fetchImages =()=>{};

	const UPLOAD_AN_IMAGE = `
		mutation uploadAnImage($image: AddImageInput!){
			uploadAnImage(image: $image) {
				image{
					id
					dataUri
					title
					description
				}
			}
		}`

    function handleFileChange(event) {
	  const target = event.target;
	  file = target.files[0]; 
  
	  if (file) {
		const reader = new FileReader();
  
		reader.onloadend = (event) => {
			const result = event.target.result; 
        
        if (typeof result === 'string') {
          imageUri = result; 
          console.log('Data URL:', imageUri); 
        } else {
          console.error('Unexpected result type:', typeof result); 
        }
      };
		reader.readAsDataURL(file);
	  }
	}

    async function uploadImage() {
		try {
			if (!imageUri) return; 
			const token = localStorage.getItem('token');
			
			const response = await axios({
				url: 'http://localhost:4000/graphql',
				method: 'POST',
				data:{
					"query": UPLOAD_AN_IMAGE,
					"variables": {
						image: {
							dataUri: imageUri,
							title: title,
							description: description
						}
					}
				},
				headers: {
					Authorization: token ? `Bearer ${token}` : '',
				},
				withCredentials: true,
				});

			console.log(response);
			fetchImages(); 
			file = null; 
			imageUri = '';
			title= '';
			description ='';
			console.log('Upload failed');
			}
			catch (error) {
				if (error.response) {
					errorMessage = error.response.data.error || 'Failed to add book.';
					console.error(error.response.data.error);
				} else if (error.request) {
					errorMessage = 'No response received from the server.';
					console.error('No response received:', error.request);
				} else {
					errorMessage = 'Failed to add book.';
				}
			}
		}

</script>

<div class='form-modal'>
    <button class='close' on:click={toggleForm}>&times;</button>
    <h2>Upload Image</h2>
    <form on:submit={uploadImage} class='form-container'> 
        <div class='form-group'>
            <label id='title' for='title'>Title of Image</label>
            <input type='text' id='title' name='title' placeholder="Enter the title of image" bind:value={title} required/>
        </div>

        <div class='form-group'>
            <label id='description' for='description'>Description of Image</label>
            <textarea id='title' name='title' placeholder="Enter the title of image" maxlength=500 rows=5 bind:value={description} required/>
        </div>

        <div class='form-group'>
            <label id='file-label' for='file'>Select Image</label>
            <input type='file' id='file' name='image' accept='image/*'  on:change={handleFileChange} required/>
            <h4>Image Preview</h4>
            <img src={imageUri ? imageUri: ''} alt='' width=100px height=100px />
        </div>

        <div class='form-group'>
            <input id='uploadBtn' type='submit' value='submit'/>
        </div>
    </form> 
    
</div>

<style>
    .form-modal{
		position: fixed;
		z-index: 100000;
		top: 6%;                        
    	left: 20%;
		width: 60%;
		height: 90%;
		overflow: auto;
		background-color: white;
		border-radius: 8px;
	}

	.form-container {
        width: 60%;
		height: 100%;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: #f9f9f9;
    }
	.form-group{
		margin-bottom: 20px;
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
	.form-group textarea{
		width: 100%;
        padding: 8px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 3px;
	}

	#file{
		font-size: 16px;
		color: #474344;
	} 

	
	#title{
		color:#474344;
	}

    
	#uploadBtn {
		background-color:rgba(67,141,224,255);
		color: rgb(255 255 255);
		border-radius: 8px;
		width: 100px;
		height: 30px;
		font-size: 16px;
		margin-top: 10px;
		padding: 0;
		cursor: pointer;
		border: 0cap;
	}
	#uploadBtn:hover{
		background-color: rgb(31, 68, 189);
	}

	.close{
		position: absolute;
		top: 0;
		right: 0;
		font-size: 30px;
		border: none;
		outline: none;
		background-color:white;
	}
</style>