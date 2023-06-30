<script>
    import {page} from "$app/stores";
    import {placemarkService} from "../services/placemark-service.js";
    import {imageSuccessfullyUploaded} from "../stores.js";

    export let imgName = "Image Name";
    let files;
    export let imageUploadStatus = false;
    export let successUploadingImage;

    function fileChange(event) {
        setTimeout(() => {
            imgName = URL.createObjectURL(files[0]);
        }, 500);
    }

    async function uploadImage() {
        const id = $page.params.id;

        let dataForm = new FormData();
        dataForm.append("image", files[0]);

        let response = await placemarkService.addImage(id, dataForm);
        files = null;

        if(response) {
            imageSuccessfullyUploaded.set(response);
        } else {
            imageSuccessfullyUploaded.set({ success: false });
        }
    }
</script>

<div class="box p-3">
    {#if imageUploadStatus}
        {#if successUploadingImage}
            <div class="notification is-success">
                <button class="delete"></button>
                An Image has been added successfully!
            </div>
        {:else}
            <div class="notification is-danger">
                <button class="delete"></button>
                Adding an Image has failed!
            </div>
        {/if}
    {/if}

    {#if files && files.length > 0}
        <img src={imgName} alt="Selected"/>
        <button class="button my-2 is-primary" on:click={uploadImage}>
            <i class="fas fa-cloud-upload-alt mr-2"></i>
            Add an Image!
        </button>
    {/if}

    <div class="file has-name is-fullwidth">
        <label class="file-label">
            <input class="file-input" on:change={fileChange} name="resume" bind:files type="file" accept="image/png, image/jpg, image/jpeg">
            <span class="file-cta">
                <span class="file-icon">
                    <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">
                    Select a file.
                </span>
            </span>
            <span class="file-name limited-file-name">
                {imgName}
            </span>
        </label>
    </div>
</div>