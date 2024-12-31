<script>
	import axios from 'axios';

	import { token } from './authStore';
	import { imagesData, page, limit, orderBy, search, sortBy, totalImages } from './imagesStore';

	import { onMount } from 'svelte';
	import {navigate} from 'svelte-routing';

    import Pagination from './pagination.svelte';
    import Search from './Search.svelte';
    import Filter from './Filter.svelte';
    import UploadForm from './UploadForm.svelte';
    import ImagesData from './ImagesData.svelte';
    import ImageView from './ImageView.svelte';


    import Footer from './Footer.svelte';


	let file = null; 
	let imageUri = ''; 
	let title = '';
	let description='';
	let errorMessage='';
	let showModal = false;
	let imageData = {};
	let isOpen= false;
	let openForm = false;
	let openSort = false;
	let openLimit = false;
	let openOrder = false;

	$: totalPages = Math.ceil($totalImages/$limit);

	const FETCH_USER_IMAGES = `
		query getUserImages($limit: Int, $orderBy: String, $page: Int, $search: String, $sortBy: String){
			getUserImages(limit: $limit orderBy: $orderBy page: $page search: $search sortBy: $sortBy) {
				images {
					id
					dataUri
					title
					description
					userId
				}
				totalImages
				page
				limit
			}
		}`

	const GET_AN_IMAGE = `
		query getAnImage($getAnImageId: ID!){
			getAnImage(id: $getAnImageId) {
				id
				dataUri
				title
				description
				userId
		}
	}`

	const DELETE_AN_IMAGE = `
		mutation deleteAnImage($deleteAnImageId: ID!){
			deleteAnImage(id: $deleteAnImageId){
				message
			}
	}`


	$: columns = [[], [], [],[]];

	$: {
		columns = [[],[],[],[]]
		$imagesData.forEach((image, index) => {
			const columnIndex = index % 4;
			columns[columnIndex].push(image);
			columns = columns;
		});
	}
	$: console.log(columns);

	const fetchImages = async () => {
		try {
			const result = await axios({
				url: 'http://localhost:4000/graphql',
				method: 'POST',
				headers: {
						Authorization: token ? `Bearer ${$token}` : '',
					},
				withCredentials: true,
				data:{
					"query": FETCH_USER_IMAGES,
					"variables": {
						limit: $limit,
						page: $page,
						search: $search,
						sortBy: $sortBy,
						orderBy: $orderBy
					}
				},
				});

			console.log(result)
			imagesData.set(result.data.data.getUserImages.images);
			totalImages.set(result.data.data.getUserImages.totalImages);
			console.log(imagesData)
			console.log(totalImages);
		}
		catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                alert('Session expired. Please log in again.');
                navigate('/login');
            } else {
                errorMessage = error.response.data.error || 'Failed to load data.';
            }
            console.error(error.response.data.error);
        } else if (error.request) {
            errorMessage = 'No response received from the server.';
            console.error('No response received:', error.request);
        } else {
            errorMessage = 'Failed to load data.';
            console.error('Error setting up request:', error.message);
        }
    }
	}

	const getImage = async(imageId)=>{
		try{
			const response = await axios({
				url: 'http://localhost:4000/graphql',
				method: 'POST',
				headers: {
						Authorization: token ? `Bearer ${$token}` : '',
					},
				withCredentials: true,
				data: {
					"query": GET_AN_IMAGE,
					"variables": {
						getAnImageId: imageId
					}
				}});
			

			imageData = response.data.data.getAnImage;
			console.log(response);
		}
		catch(error){
			console.log(error.message)
		}
	}

	const remove = async(imageId)=>{
		try{
			const response =  await axios({
				url: 'http://localhost:4000/graphql',
				method: 'POST',
				data: {
					"query": DELETE_AN_IMAGE,
					"variables": {
						deleteAnImageId: imageId,
					}
				},
				headers: {
					Authorization: token ? `Bearer ${$token}` : '',
				},
				withCredentials: true,
				})
			
			fetchImages();
		}
		catch(error){
			console.log(error.message)
		}
	}

	// const logout = async () => {
    // try {
    //     const response = await axios.post('http://localhost:3000/logout', {}, {
    //         headers: {
    //             'Authorization': `Bearer ${localStorage.getItem('token')}`
    //         }
    //     });

    //     if (response.status === 200) {
    //         sessionStorage.removeItem('token');
    //         navigate('/login');
    //     }
    // } catch (error) {
      
    //     console.error('Logout error:', error);

    //     alert('An error occurred while logging out. Please try again.');
    // }

	// }



	const handleChangePage = (newPage) =>{
        if(newPage<1 || newPage>totalPages) return;
        page.set(newPage);
		fetchImages();
    }

	const toggle = ()=>{
		showModal =! showModal;
		console.log(showModal)
	}

	onMount(()=>{fetchImages()});

	const toggleForm = () =>{
		openForm =! openForm;
	}

	let sortByTitle = () =>{
        sortBy.set('title');
		fetchImages();
    }
    let sortBycreatedAt = () =>{
        sortBy.set('createdAt');
		fetchImages();
    }

	let orderByAsc = ()=> {
		orderBy.set('ASC');
		fetchImages();
	}

	let orderByDesc = ()=> {
		orderBy.set('DESC');
		fetchImages();
	}
	let limitBy = () =>{
		limit.set($limit);
		fetchImages();
	}
	
	let toggleSortBy = () =>{
		openSort =!openSort;
	}
	let toggleOrderBy = () =>{
		openOrder =!openOrder;
	}
	let toggleLimitBy = () =>{
		openLimit =!openLimit;
	}

	let scrolled;
	
	onMount(() => {
		page.set(1);

		const handleScroll = () =>{
			scrolled = window.scrollY>10;
			console.log(scrolled);
		}

		window.addEventListener('scroll', handleScroll);

		return () => {
		window.removeEventListener('scroll', handleScroll);
		};
	});


  </script>


<header style="background-color: {(scrolled && $page===1)||($page>=2)? '#ffffff': ''}">

	<Search {scrolled} {fetchImages}>
			<button slot='uploads' id="uploadImage" on:click={toggleForm}>
				<i class='fa fa-upload'></i> Upload 
			</button>	
	</Search>

</header>

{#if $page===1}	
<div class='bg'>
	<img src="/bg5.jpg" alt="" />
	<div class='search-head'>
		<div class='heading'>
			<h1>Through the Lens: A Gallery of Captivating Moments</h1>
			<h2>Experience art, emotion, and elegance, captured in every shot</h2>
		</div>
		{#if !scrolled}
		<div class='search-bar'>
			<button id='search' type="submit"><i class="fa fa-search"></i></button>
			<input type='text' placeholder="Search for images" bind:value={$search}  on:input={fetchImages}/>
			<button id='clear' on:click={()=>{{search.set('')};fetchImages()}} type='submit'>&times;</button>
		</div>
		{/if}
	</div>
		
</div>
{/if}

<div class='filter' style="position: {(scrolled && $page===1)||($page>=2)? 'fixed': 'static'}">
	<Filter {sortBycreatedAt} {orderByAsc} {orderByDesc} 
			{openSort} {limitBy} {openOrder} {toggleSortBy} {toggleLimitBy} {toggleOrderBy} {scrolled} total={$totalImages}>
			<span slot='photo'><i class="fa fa-image"></i> Photos</span>
			<button slot='sort' id='sortBy'
                on:click={() => {
                    sortByTitle();
                    toggleSortBy();
                }}>Title</button
            >
	</Filter>
</div>

	
<div class="opensidebar" style="margin-top: {($page>=2) ? '150px': '0px'}">
	<ImagesData {columns} {toggle} {getImage}/>

    {#if showModal}
        <ImageView {toggle} {imageData} {remove}/>
    {/if}


	{#if openForm}
		<UploadForm {title} {description} {file} {imageUri} {toggleForm}/>
	{/if}
	
</div>

<Pagination totalPages={totalPages} changePage={handleChangePage}/>

<Footer/>

<style>
	#sortBy{
        width: 100%;
        border: none;
        background-color: #ffffff;
        color: #7a8086;
        font-size: 14px;
        font-weight: normal;
    }
    #sortBy:hover{
        background-color: #f7f7f7;
		color: #111111;
    }
	.opensidebar{
		padding: 20px;
	}
	.filter{
		top: 76px;
		left: 0;
		right: 0;
		z-index: 1;
		height: 60px;
		background-color: #ffffff;
		border-bottom: 1.5px solid #f2f3f5;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.heading h2{
		font-weight: 400;
		font-size: 18px;
		margin: 0 0 24px;
		color: #fff;
		text-align: left;
	}
	.heading h1{
		color: #ffffff;
		font-size: 32px;
		line-height: 48px;
		font-weight: 700;
		margin: 0 0 8px;
		text-align: left;
	}
	.search-head{
		position: absolute;
		top: 30%;
		left: 20%;
		display: flex;
		flex-direction: column;
	}
	.search-bar{
		display: flex;
		gap: 0px;
		align-items: center;
		justify-content: center;
	}
	.search-bar Input{
		width: 650px;
		height: 60px;
		padding: 0;
		font-size: medium;
		outline: none;
		border: none;
		background-color: #f7f7f7;

	}
	#search{
		height: 60px;
		width: 100px;
		outline: none;
		border: none;
		border-radius: 0%;
		border-top-left-radius: 30px;
		border-bottom-left-radius: 30px;
		background-color: #f7f7f7;
		color: #696a71;
		font-size: 14px;
	}
	#clear{
		height: 60px;
		width: 50px;
		border-radius: 0%;
		border-top-right-radius: 30px;
		border-bottom-right-radius: 30px;
		border: none;
		outline: none;
		font-size: 16px;
		background-color: #f7f7f7;
		color: #696a71;
	}
	.bg{
		position: relative;
		top: 0;
		width: 100%;
		height: 450px;
	}
	.bg img{
		width: 100%;
		height: 100%;
		opacity: 0.9;
	}
	
	header{
		position: fixed;
		z-index: 100;
		top: 0;
		left: 0;
		right: 0;
		margin-top: 0px;
	}

	#uploadImage{
		background-color:#00ab6b;
		color: rgb(255 255 255);
		border-radius: 20px 20px 20px 20px;
		margin-inline-start: 20px;
		width: 100px;
		height: 40px;
		font-size: 16px;
		margin: 0 auto;
		padding: 0;
		border: 0;
        cursor: pointer;
		font-size: 15px;
	}
	#uploadImage:hover{
        background-color: #21d392;
    }


	:global(body){
		background-color: #ffffff;
	}
	
</style>
