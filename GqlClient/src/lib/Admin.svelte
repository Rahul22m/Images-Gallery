<script>
	import { token } from './authStore';
	import {imagesData, page, limit, orderBy, search, sortBy, totalImages } from './imagesStore';

	import axios from 'axios';
 

    import {onMount} from 'svelte';
    import {navigate} from 'svelte-routing';
    import Pagination from './pagination.svelte';
    import Search from './Search.svelte';
    import Filter from './Filter.svelte';
    import ImagesData from './ImagesData.svelte';
    import ImageView from './ImageView.svelte';
    import Signup from './Signup.svelte';
    import Footer from './Footer.svelte';

    let errorMessage='';

    let isOpen = false;
    let showModal = false;

    let imageData = {};
    
    let openSort= false;
    let openOrder = false;
    let openLimit = false;

    let scrolled = true;

    $: totalPages = Math.ceil($totalImages/$limit);

    const GET_ALL_USERS_IMAGES = `
        query getAllUsersImages($limit: Int, $orderBy: String, $page: Int, $search: String, $sortBy: String){
            getAllUsersImages (limit: $limit orderBy: $orderBy page: $page search: $search sortBy: $sortBy){
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

    const GET_AN_IMAGE_BY_ADMIN = `
        query getAnImageByAdmin($getAnImageByAdminId: ID!){
            getAnImageByAdmin(id: $getAnImageByAdminId) {
                id
                dataUri
                title
                description
                userId
        }
    }`

	const DELETE_AN_IMAGE_BY_ADMIN = `
		mutation deleteAnImageByAdmin($deleteAnImageByAdminId: ID!){
			deleteAnImageByAdmin(id: $deleteAnImageByAdminId){
				message
			}
	}`

    let toggle = ()=>{
		showModal =! showModal;
		console.log(showModal)
	}

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

	

    let fetchAllImages = async()=>{
		try{
			 const response = await axios({
                url: 'http://localhost:4000/graphql',
                method: 'POST',
                data: {
                    "query": GET_ALL_USERS_IMAGES,
					"variables": {
						page: $page,
						limit: $limit,
						search: $search,
						sortBy: $sortBy,
						orderBy: $orderBy
					}
                },
                 headers: {
                    Authorization: token ? `Bearer ${$token}` : '',
                },
                withCredentials: true,
            });
            console.log(`Fetching images with: limit=${limit}, sortBy=${sortBy}, orderBy=${orderBy}`);
			imagesData.set(response.data.data.getAllUsersImages.images)
            totalImages.set(response.data.data.getAllUsersImages.totalImages);
            console.log(imagesData);
		}
		catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
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
						"query": GET_AN_IMAGE_BY_ADMIN,
						"variables": {
							getAnImageByAdminId: imageId
						},
                }
            });

			imageData = response.data.data.getAnImageByAdmin;
			console.log(response);
		}
		catch(error){
			console.log(error.message)
		}
	}

   const remove = async(imageId)=>{
		try{
			const response = await axios({
                url: 'http://localhost:4000/graphql',
                method: 'POST',
                data: {
						"query": DELETE_AN_IMAGE_BY_ADMIN,
						"variables": {
							deleteAnImageByAdminId: imageId,
						}
                },
                 headers: {
                    Authorization: token ? `Bearer ${$token}` : '',
                },
                withCredentials: true,
            });

			
			fetchAllImages();
		}
		catch(error){
			console.log(error.message)
		}
	}

    const handleChangePage = (newPage) =>{
        if(newPage<1 || newPage>totalPages) return;
        page.set(newPage);
		fetchAllImages();
    }

	onMount(()=>{
		page.set(1);
		fetchAllImages()
	});

    let sortByTitle = () =>{
        sortBy.set('title');
		fetchAllImages();
    }
    let sortBycreatedAt = () =>{
        sortBy.set('createdAt');
		fetchAllImages();
    }

	let orderByAsc = ()=> {
		orderBy.set('ASC');
		fetchAllImages();
	}

	let orderByDesc = ()=> {
		orderBy.set('DESC');
		fetchAllImages();
	}
	let limitBy = () =>{
		limit.set($limit);
		fetchAllImages();
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
	let showModalSignup = false;
	let toggleButton = () => {
		showModalSignup =! showModalSignup;
	}
</script>


<header>
    <Search {scrolled} fetchImages={fetchAllImages}>
    		<button slot='uploads' class='add-button' on:click={toggleButton}>
				Add User
			</button>
	</Search>

		
    <Filter {limitBy} {sortBycreatedAt} {orderByAsc} {orderByDesc} {openSort} {openOrder} {toggleSortBy} {toggleLimitBy} 
		{toggleOrderBy} {scrolled} total={$totalImages}>
		<span slot='photo'><i class="fa fa-image"></i> Photos</span>
			<button slot='sort' id='sortBy'
				on:click={() => {
					sortByTitle();
					toggleSortBy();
				}}>Title</button
			>
	</Filter>
</header>

{#if showModalSignup}
	<div class="modal">
		<div class="modal-content">
			<button class="close" on:click={toggleButton}>&times;</button>
			<Signup/>
		</div>
	</div>
{/if}


<div class="opensidebar">
    <ImagesData {columns} {toggle} {getImage}/>

    {#if showModal}
        <ImageView {toggle} {imageData} {remove}/>
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
	.add-button{
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
	.add-button:hover{
        background-color: #21d392;
    }

    .opensidebar{
		margin-top: 130px;
        padding: 20px;
	}
    header{
		position: fixed;
		z-index: 1;
		background-color: #ffffff;
		top: 0;
		left: 0;
		right: 0;
		margin-top: 0px;
		border: 1.5px solid #f2f3f5;
	}
	.modal {
        display: flex;
        position: fixed;
        z-index: 1000;
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
</style>


