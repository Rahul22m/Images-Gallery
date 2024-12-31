<script>
	import '@fortawesome/fontawesome-free/css/all.css';

    export let columns;

	export let toggle = ()=>{};


	export let getImage = (imageId)=>{};
</script>

<div class='gallery'>
	{#each columns as column}
		<div class='columns'>
			{#each column as image, i (image.id)}
				<div class='image'>
					<div class='article'>
						<div class='img'>
							<img src={image.dataUri} alt ='placeimage'/>
						</div>
						<h3 class='title'>{image.title}</h3>
						<div class='eyeDiv'>
							<button class='eye' on:click={()=>{toggle(); getImage(image.id)}}>
								<i class="fa fa-eye"></i>
							</button>
						</div>
					</div>
					
				</div>
			{/each}
		</div>
	{/each}
</div>

<style>
	.gallery{
		display: flex;
		box-sizing: border-box;
		position: relative;
		width: 100%;
		height: 100%;
		align-items: stretch; 
		gap: 20px;
	}

	.columns{
		display: flex;
		flex-direction: column;		
		flex: 1 1;
		width: 100%;
		min-width: 0;
		align-items: stretch;
		justify-content: flex-start;
		overflow: hidden;
	}
	.img{
		width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		outline: none;
	}

	.image:hover .eye{
		visibility: visible;
	}
	.image:hover .title{
		visibility: visible;
	}

	.image{
		margin-bottom: 15px;
		background-color: #f9f7fa;
	}

	.image img{
		width: 100%;
		min-height: 350px;
		height: auto;
		object-fit:cover;
	}

	.image:hover .img {
		filter: brightness(70%);  
	}
	.article{
		position: relative;
		width: 100%;
		height: 100%;
		contain: content;
		overflow: hidden;
	}

    .title {
		position: absolute;
		top:78%;
		color: #ffffff;
		width: 100%;
		height: 40px;
		padding: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		visibility: hidden;
	}
	.eye{
		position: absolute;
		top: 5%;
		left: 5%;
		width: 2.5px;
		height: 35px;
		border-radius: 20%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: hsla(0, 0%, 100%, .1);
		border: 1px solid hsla(0, 0%, 100%, .4);
		visibility: hidden; 
	}
	.eye i{
		color: #ffffff;
	}
</style>