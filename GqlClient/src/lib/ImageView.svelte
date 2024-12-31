<script>

    export let imageData;
	export let toggle= ()=>{};

	export let remove = (imageId)=>{};
    

</script>

<div class='modal'>
    <div class="modal-content">
        <button class="close" on:click={toggle}>&times;</button>
        <img src={imageData.dataUri} alt=""/>
        <h3>{imageData.title}</h3>
        <p>{imageData.description}</p>
        <button id='delete' on:click={()=>{remove(imageData.id); toggle()}}><i class="far fa-trash-alt"></i></button>
    </div>
</div>

<style>
    .modal{
		display: flex;
		position: fixed;
		z-index: 100000;
		left: 0;
		top: 1%;
		width: 100%;
		height: 100%; 
		overflow: auto;
		background-color: rgba(0,0,0,0.4);
	}
	
	.modal-content {
		background-color: white;
		margin: auto;
		padding: 20px;
		border: 1px solid #888;
		width: 50%;
		height: 100%;
		overflow:auto;
	}
	.modal-content img{
		width: 50%;
		height: 50%;
		/* margin-left: 80px; */
	}
    .close {
		width: 30px;
		height: 30px;
		color: #aaa;
		position: absolute;
		top: 0;
		right: 24%;
		font-size: 28px;
		font-weight: bold;
		background: none;
		border: none;
		outline: none;
		margin: 0 auto;
		padding: 0;
		border-radius: 0px;
	}
	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
		cursor: pointer;
	}
    
	#delete{
		background-color: #ffffff;
		/* color: rgb(244, 245, 249); */
		font-size: 24px;
		width: 100px;
		height: 30px;
		margin: 0 auto;
		padding: 0;
		cursor: pointer;
		border-radius: 0px;
		border: none;
		outline: none;
	} 
</style>