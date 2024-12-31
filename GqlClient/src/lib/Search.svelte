<script>
	import { page, search } from "./imagesStore";

	let open =false;

	const toggle = ()=>{
		open =!open;
	}

	

    export let fetchImages = () => {};

	export let scrolled = false;

	const clearSearch = () =>{
		search.set("");
		fetchImages();
		console.log($search)

	}
	const logout = ()=>{
		localStorage.removeItem('token')
	};

</script>

<div class='head'>
	<h2 style="color: {(!scrolled && $page===1)? '#ffffff':'#696a71'}">imagesStock</h2>

	{#if scrolled || $page>=2}
		<button id='search' type="submit"><i class="fa fa-search"></i></button>
		<input type='text' placeholder="Search images by title" bind:value={$search}  on:input={fetchImages}/>
		<button id='clear' on:click={()=>{clearSearch(); fetchImages()}} type='submit'>&times;</button>
	{/if}
	<button class="dropdown-btn" on:click={toggle} style="margin-inline-start: {(!scrolled && $page===1) ? "730px":"15px"} ; color: {(!scrolled && $page===1)?'#ffffff':'#696a71' }">Admin
		<i class="fa fa-caret-down"></i>
	</button>
	{#if open}
		<div class="dropdown-container" >
			<div class="dropdown-content">
				<a href="/getusers">Users</a>
				<a href="/users">Users Images</a>
				<a href="/images">Back To Home</a>
			</div>
		</div>
	{/if}
	<a href="/login" id='login' on:click={logout} style="color: {(!scrolled && $page===1) ? '#ffffff':'#696a71'}"><i class='fa fa-sign-out'></i> Logout</a>
	<slot name='uploads'></slot>
</div>
	

<style>
	a {
		margin-inline-start: 20px;
		font-size: 15px;
	}
	.dropdown-btn{
		width: 110px;
		border-radius: 20px 20px 20px 20px;
		border: none;
		background-color: inherit;
		/* color: #696a71; */
		/* color: #ffffff; */
		outline: none;
		font-size: 15px;
	}
	.dropdown-container{
		position: absolute;
		z-index: 100;
		top: 60px;
		right: 230px;
		background-color:#ffffff;
        border: 0.1px solid #eeeeee;
		border-radius: 8px;
		outline :#ffffff;
		height: 100px;
		width: 110px;
	}
	.dropdown-content{
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	.dropdown-content a:hover{
		background-color: #f7f7f7;
		color: #111111;
	}

	.dropdown-content a{
		width: 100%; 
		height: 40px;
		color: #7a8086;
        font-size: 14px;
        font-weight: normal;
		margin-left: 0px;

	}

    .head{
		display: flex;
		align-items: center;
		margin-left:35px ;
		margin-top: 0px;
	}

	.head input{
		width: 600px;
		height: 40px;
		padding: 0;
		font-size: medium;
		outline: none;
		border: none;
		background-color: #f7f7f7;

	}
	#search{
		height: 40px;
		margin-inline-start: 20px;
		outline: none;
		border: none;
		border-radius: 0%;
		border-top-left-radius: 40%;
		border-bottom-left-radius: 40%;
		background-color: #f7f7f7;
		color: #696a71;
		font-size: 14px;
	}
	#clear{
		height: 40px;
		border-radius: 0%;
		border-top-right-radius: 40%;
		border-bottom-right-radius: 40%;
		border: none;
		outline: none;
		font-size: 16px;
		background-color: #f7f7f7;
		color: #696a71;
	}
</style>