<script>
    import Coordinates from "./Coordinates.svelte";
    import { placemarkService} from "../services/placemark-service.js";

    let name = "";
    let lat = 49.026141375017936;
    let lng = 12.115972979986031;
    let description = "";
    let message = "Please create a new Placemark";
    let category = "";

    async function createPlacemark() {
        if (name && lat && lng) {
            const placemark = {
                name: name,
                lat: lat,
                lng: lng,
                description: description,
                category: category ? category: "Other",
            };
            console.log(placemark.category);
            const success = await placemarkService.addPlacemark(placemark)
            if (!success) {
                message = "Creation failed";
                return;
            }
            message = "You've added a new Placemark!";
            console.log("back in the frontend");
            console.log()
        } else {
            message = "You have to enter name, coordinates and a short description";
        }
    }
</script>

<form on:submit|preventDefault={createPlacemark}>
    <div class="field">
        <label class="label" for="name">Enter Name</label>
        <input bind:value={name} class="input" id="name" name="name" type="text" />
    </div>
    <Coordinates bind:lat bind:lng />
    <div class="field">
        <label class="label" for="description">Enter Description</label>
        <input bind:value={description} class="input" id="description" name="description" type="text" />
    </div>
    <div class="field">
        <label class="label" for="category">Enter Category</label>
        <input bind:value={category} class="input" id="category" name="category" type="text" />
    </div>
    <div class="field">
        <div class="control">
            <button class="button is-link is-light">Create Placemark</button>
        </div>
    </div>
    <div class="box">
        {message}
    </div>
</form>