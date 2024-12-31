<script>
    // import { clickOutside } from "./clickOutside";
    import { page, limit, totalImages, orderBy, sortBy, search} from "./imagesStore";

    export let openSort;
    export let openOrder;
    export let total;

    export let toggleSortBy = () => {};
    export let toggleOrderBy = () => {};
    export let toggleLimitBy = () => {};

    export let sortBycreatedAt = () => {};
    export let limitBy = () => {};

    export let orderByAsc = () => {};
    export let orderByDesc = () => {};


    export let scrolled;

    $: console.log("limit:", $limit, "sortBy:", $sortBy, "orderBy:", $orderBy, "search:", $search);
</script>

<div class="filter">
    <div id="photos">
        <slot name='photo'></slot> {total}
    </div>

    <div class="limit">
        <button id="limit" on:click={toggleLimitBy}
            ><i class="fa fa-eye"></i>Display 
            <span>
                <input type= 'number' id='limitInput' bind:value={$limit} on:input={limitBy}>
            </span>
        </button>
    </div>

    <div class="sort">
        <button id="sort" on:click={toggleSortBy}>
            <i class="fa fa-sort"></i> Sort By
            {#if $sortBy === 'title'}
                <span>Title</span>
            {/if}
            {#if $sortBy === 'createdAt'}
                <span>CreatedAt</span>
            {/if}
            {#if $sortBy === 'email'}
                <span>Email</span>
            {/if}
            <i class="fa fa-caret-down"></i>
        </button>
    </div>

    {#if openSort}
        <div  class="sortBy" style="top: {scrolled && $page === 1 || $page>=2? '21%' : '84%'}">
            <span>Sort by</span>
            <slot name='sort' id='slot'></slot>
            <button
                on:click={() => {
                    sortBycreatedAt();
                    toggleSortBy();
                }}>CreatedAt</button
            >
        </div>
    {/if}

    <div class="order">
        <button id="order" on:click={toggleOrderBy}
            ><i class="fa fa-sort-amount-asc"></i>Order By
            <span>{$orderBy}</span><i class="fa fa-caret-down"></i></button
        >
    </div>

    {#if openOrder}
        <div id="orderBy" style="top: {scrolled && $page === 1|| $page>=2 ? '21%' : '84%'}">
            <span>Order by</span>
            <button
                on:click={() => {
                    orderByAsc();
                    toggleOrderBy();
                }}>ASC</button
            >
            <button
                on:click={() => {
                    orderByDesc();
                    toggleOrderBy();
                }}>DESC</button
            >
        </div>
    {/if}
</div>

<style>
    #limitInput{
        width: 100%;
        outline: none;
        border: none;
    }
    #limitInput:hover{
        background-color: #f7f7f7;
    }
    .filter {
        text-align: center;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    #photos {
        margin-inline-end: 570px;
        color: #111111;
        font-size: 14px;
    }

    .limit {
        background-color: #ffffff;
        width: 140px;
        height: 30px;
    }

    #limit {
        display: flex;
        gap: 6%;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: 0.1px solid #eeeeee;
        outline: none;
        background-color: #ffffff;
        color: #7a8086;
        font-size: 14px;
        font-weight: normal;
    }
    #limit:hover {
        background-color: #f7f7f7;
    }

    span {
        color: #111111;
        font-size: 16px;
    }

    .sort {
        background-color: #ffffff;
        width: 200px;
        height: 30px;
    }
    #sort {
        display: flex;
        gap: 6%;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: 0.1px solid #eeeeee;
        outline: none;
        background-color: #ffffff;
        color: #7a8086;
        font-size: 14px;
        font-weight: normal;
    }
    #sort:hover {
        background-color: #f7f7f7;
    }

    .order {
        background-color: #ffffff;
        width: 180px;
        height: 30px;
    }
    #order {
        display: flex;
        gap: 6%;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: 0.1px solid #eeeeee;
        outline: none;
        background-color: #ffffff;
        color: #7a8086;
        font-size: 14px;
        font-weight: normal;
    }
    #order:hover {
        background-color: #f7f7f7;
    }

    .sortBy {
        position: fixed;
        z-index: 1;
        top: 21%;
        left: 67.5%;
        background-color: #ffffff;
        width: 130px;
        border-radius: 5px;
        border: 0.1px solid #eeeeee;
    }
    .sortBy button {
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
    .sortBy button:hover {
        background-color: #f7f7f7;
        color: #111111;
    }

    #orderBy {
        position: fixed;
        z-index: 1;
        top: 21%;
        left: 84.5%;
        background-color: #ffffff;
        width: 130px;
        border-radius: 5px;
        border: 0.1px solid #eeeeee;
    }
    #orderBy button {
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
    #orderBy button:hover {
        background-color: #f7f7f7;
        color: #111111;
    }
    #orderBy span,
    .sortBy span {
        margin-right: 45px;
    }
</style>
