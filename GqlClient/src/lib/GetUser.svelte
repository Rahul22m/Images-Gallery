<script>

    import { token } from "./authStore";
    import { page, limit, orderBy, sortBy, search, totalUsers, users } from "./imagesStore";
  
    import axios from "axios";
    import { onMount } from "svelte";
    import Signup from "./Signup.svelte";
    import Search from "./Search.svelte";
    import Pagination from "./pagination.svelte";
    import Filter from "./Filter.svelte";
    import Footer from "./Footer.svelte";

    let showModal =  false;

    let scrolled = true;


    $: totalPages = Math.ceil($totalUsers/$limit);

    const GET_USERS = `
        query getUsers($limit: Int, $orderBy: String, $page: Int, $search: String, $sortBy: String){
            getUsers(limit: $limit orderBy: $orderBy page: $page search: $search sortBy: $sortBy) {
                users {
                    id
                    email
                    createdAt
                }
                totalUsers
                page
                limit
            }
        }`

    const DELETE_AN_USER = `
        mutation deleteUser($deleteUserId: ID!){
            deleteUser(id: $deleteUserId){
                message
            }
        }`

    const fetchUsers = async() =>{
        try{
            const response = await axios({
                url: 'http://localhost:4000/graphql',
                method: 'POST',
                data: {
                    "query": GET_USERS,
                    "variables": {
                        limit: $limit,
                        page: $page,
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
            users.set(response.data.data.getUsers.users);
            totalUsers.set(response.data.data.getUsers.totalUsers);
            console.log($users);
        }
        catch(error){
            if(error){
                console.log(error.message)
            }
        }
    }

    onMount(()=>{
        page.set(1);
        fetchUsers()
    });

    

	const remove = async(userId)=>{
		try{
           const response = await axios({
                url: 'http://localhost:4000/graphql',
                method: 'POST',
                data: {
                    "query": DELETE_AN_USER,
                    "variables": {
                         deleteUserId: userId,
                        }
                },
                headers: {
                    Authorization: token ? `Bearer ${$token}` : '',
                },
                withCredentials: true,
            });
           console.log(userId)


           fetchUsers();
            // $users = $users.filter(element => element.id!==userId);
        }
        catch(error){
            console.log(error.message)
        }
	}

    const toggle = ()=>{
        showModal =! showModal;
    }

    const handleChangePage = (newPage) =>{
        if(newPage<1 || newPage>totalPages) return;
        page.set(newPage);
		fetchUsers();
    }

    let openSort = false;
    let openLimit = false;
    let openOrder = false;

    let sortBycreatedAt = () =>{
        sortBy.set('createdAt');
		fetchUsers();
    }

    let sortByEmail = () =>{
        sortBy.set('email');
        fetchUsers();
    }

	let orderByAsc = ()=> {
		orderBy.set('ASC');
		fetchUsers();
	}

	let orderByDesc = ()=> {
		orderBy.set('DESC');
		fetchUsers();
	}
	let limitBy = () =>{
		limit.set($limit);
		fetchUsers();
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
</script>


<header>
    <Search {scrolled} fetchImages={fetchUsers}>
    <button slot='uploads' class='add-button' on:click={toggle}>Add User</button>
    </Search>
</header>

<div class='filter' style="position: {(scrolled && $page===1)||($page>=2)? 'fixed': 'static'}">
	<Filter {limitBy} {sortBycreatedAt} {orderByAsc} {orderByDesc} 
			{openSort} {openOrder} {toggleSortBy} {toggleLimitBy} {toggleOrderBy} {scrolled} total={$totalUsers}>
            <span slot='photo'><i class="fas fa-user-alt"></i> Users</span>
			<button slot='sort' id='sortBy'
                on:click={() => {
                    sortByEmail();
                    toggleSortBy();
                }}>Email</button
            >
	</Filter>
</div>

{#if showModal}
<div class="modal">
    <div class="modal-content">
        <button class="close" on:click={toggle}>&times;</button>
        <Signup/>
    </div>
</div>
{/if}

<div class='fixed'>
    <h3>List of Users</h3>
    <div class='head'>
        <p id='ids'>ID</p>
        <p id='userIds'>Role</p>
        <p id= 'emails'>Email</p>
        <p id='createdAts'>CreatedAt</p>
        <p id='remove'>Delete</p>
    </div>
</div>

<div class="opensidebar">
    <div class='filtered'>
        {#each $users as user, i (user.id)}
            <div class='flex'>
            <p id='id'>{user.id}</p>
            {#if user.userType==='Admin'}
                <p id='userId'>Admin</p>
            {:else}
                <p id='userId'>User</p>
            {/if}
            <p id='email'>{user.email}</p>
            <p id='createdAt'>{user.createdAt}</p>
            <button id='removed' on:click={()=>remove(user.id)}><i class='fa fa-trash-alt'></i></button>
            </div>
        {:else}
            <p>No User Found</p>
        {/each}
    </div>

</div>

<Pagination totalPages={totalPages} changePage= {handleChangePage}/>

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

    /* .filter button{
        display: flex;
        flex-direction: column;
        width: 100%;
        border: none;
        justify-content: center;
        align-items: center;
        background-color: #ffffff;
        color: #7a8086;
        font-size: 14px;
        font-weight: normal;
    }
    .filter button:hover{
        background-color: #f7f7f7;
    } */

    h3{
        display: flex;
        margin: 0px;
        margin-left: 512px;
        /* justify-content: center; */
    }

    .fixed{
        position: fixed;
        top: 137.5px;
        z-index: 1;
        background-color: #ffffff;
		/* border-bottom: 1.5px solid #f2f3f5; */
        /* border: none; */
        outline: none;
        width: 100%;
        margin-left: 23px;
        width: 96%;
    }
    .head{
        /* width: 87.5vw; */
        display: flex;
        margin: 5px;
        border: 1px solid;
        border-radius: 10px;
        box-shadow: 5px 5px 10px;
        padding: 10px;
        background-color: white;
        cursor: pointer;
        justify-content: space-evenly;
        justify-items: center;
        position: relative;
        font-weight: bold;
    }
    .filter{
		top: 76px;
		left: 0;
		right: 0;
		z-index: 10;
		height: 60px;
		background-color: #ffffff;
		border-bottom: 1.5px solid #f2f3f5;
		display: flex;
		align-items: center;
		justify-content: center;
	}
    
    header{
		position: fixed;
		z-index: 100;
		background-color: #ffffff;
		top: 0;
		left: 0;
		right: 0;
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
    .add-button{
		background-color:#00ab6b;
		color: rgb(255 255 255);
		border-radius: 20px 20px 20px 20px;
		margin-inline-start: 0px;
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
        margin-top: 253px;
        width: 100vw;
    }
	.flex{
        display: flex;
        margin: 5px;
        border: 1px solid;
        border-radius: 10px;
        box-shadow: 5px 5px 10px;
        padding: 10px;
        background-color: white;
        cursor: pointer;
        justify-content: space-evenly;
        justify-items: center;
        position: relative;
    }
    #ids{
        margin-inline-start: 80px;
        width: 5vw;
    }
    /* #userIds{
        margin-inline-start: 90px;
    } */
    #id{
        width: 5vw;
    }

    #userIds{
        width: 5vw;
        margin-inline-start: 100px;
    }

    #userId{
        width: 5vw;
    }

    #emails{
        margin-inline-start: 170px;
    }
    #email{
        width: 15vw;
        margin-left: 6px;
        margin-right: 4px;
    }
    #createdAts{
        width: 10vw;
        margin-inline-start: 220px;
    }
    #createdAt{
        width: 20vw;
        margin-left: 4px;
        margin-left: 4px;
    }
    #remove{
        margin-inline-start: 100px;
    }
    .filtered{
        width: 95%;
        margin-left: 23px;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .filtered button{
        position: absolute;
        right: 20px;
        top: 15px;
        width: 7vw;
        height: 40px;
        background-color:#ffffff;
		/* border-radius: 20px 20px 20px 20px; */
        color: rgb(248, 33, 33);
        font-size: 14px;
        /* border-radius: 8px; */
        border: none;
        outline: none;
        cursor: pointer;
        margin: 0px;
        padding: 0px;
    }
    .filtered button:hover{
        color: rgb(244, 98, 98);
    }
    .filtered button i{
       width: 100%;
       font-size: medium;
    }
</style>


