<script>
   import { page, limit, totalImages } from "./imagesStore";
    export let changePage = (page)=>{};

    export let totalPages;


    const onPageChange = (event)=>{
        const newPage = parseInt(event.target.value, 10);
        if(!isNaN(newPage) && newPage>=1 && newPage<=totalPages){
            changePage(newPage);
        }
    }
</script>


<div class="pagination-controls">
    <button on:click={() => changePage(1)} disabled={$page <= 1}>&laquo;</button>
    <button on:click={() => changePage($page - 1)} disabled={$page <= 1}>&lt;</button>
    <span id="pageDisplay">
        Page <input id="pageInput" type="number" min="1" value={$page} on:change={onPageChange}> of {totalPages}
    </span>
    <button on:click={() => changePage($page + 1)} disabled={$page >= totalPages}>&gt;</button>
    <button on:click={() => changePage(totalPages)} disabled={$page >= totalPages}>&raquo;</button>
</div>

<style>
    .pagination-controls {
        text-align: center;
        margin-top: 20px;
        margin-bottom: 20px;
    }

    .pagination-controls button {
        margin: 0 5px;
        padding: 5px 10px;
        font-size: 1.2rem;
        border: none;
        background-color: #007bff;
        color: white;
        border-radius: 5px;
        cursor: pointer;
    }

    .pagination-controls button:disabled {
        background-color: #d6d6d6;
        cursor: not-allowed;
    }

    #pageDisplay {
        margin: 0 10px;
        color: rgb(3, 0, 0);
    }

    #pageInput {
        width: 60px;
        text-align: center;
    }
</style>


    