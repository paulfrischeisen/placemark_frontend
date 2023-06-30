<script>
    import TitleBar from "$lib/TitleBar.svelte";
    import MainNavigator from "$lib/MainNavigator.svelte";
    import Chart from "svelte-frappe-charts";
    import { onMount } from "svelte";
    import { placemarkService } from "../../services/placemark-service.js";

    let placemarksByCategory = {
        labels: ["bouldering", "rock climbing", "lead/bouldering", "outdoor climbing"],
        datasets: [
            {
                values: [0, 0, 0, 0]
            }
        ]
    };

    let placemarksByContributor = {
        labels: [],
        datasets: [
            {
                values: [0, 0, 0, 0]
            }
        ]
    };

    onMount(async () => {
        let placemarkList = await placemarkService.getPlacemarks();
        placemarkList.forEach((placemark) => {
            console.log(`the category of placemark is: ${placemark.category}`);
            if (placemark.category === "bouldering") {
                placemarksByCategory.datasets[0].values[0] += 1;
            } else if (placemark.category === "rock climbing") {
                placemarksByCategory.datasets[0].values[1] += 1;
            } else if (placemark.category === "lead/bouldering") {
                placemarksByCategory.datasets[0].values[2] += 1;
            } else if (placemark.category === "outdoor climbing") {
                placemarksByCategory.datasets[0].values[3] += 1;
            }
        });
        let contributors = await placemarkService.getAllUsers();
        placemarksByContributor.labels = [];
        contributors.forEach(contributor => {
            console.log(`in the forEach for all contributors: ${contributor.firstName} and the id ${contributor._id}`);
            placemarksByContributor.labels.push(`${contributor.lastName}, ${contributor.firstName}`);
            placemarksByContributor.datasets[0].values.push(0);
        });
        contributors.forEach((contributor, i) => {
            placemarkList.forEach((placemark) => {

                console.log(`the placemark creater user: ${placemark.user} should equal the contributor id: ${contributor._id}`);
                if (placemark.user === contributor._id) {
                    placemarksByContributor.datasets[0].values[i] += 1;
                }
            })
        })
    });
</script>

<div class="columns is-vcentered">
    <div class="column is-two-thirds">
        <TitleBar subTitle={"Placemark Analytics"} title={"RockExplorer"} />
    </div>
    <div class="column">
        <MainNavigator />
    </div>
</div>

<div class="columns" style="display: grid; grid-template-columns: 1fr 1fr; grid-gap: 20px;">
    <div class="column box has-text-centered">
        <h1 class="title is-4">Placemarks to category</h1>
        <Chart data={placemarksByCategory} type="line" />
    </div>
    <div class="column has-text-centered">
        <img alt="Boulder" src="/boulder.png" width="500" />
    </div>
    <div class="column has-text-centered">
        <h1 class="title is-4">Placemarks by Contributors</h1>
        <Chart data={placemarksByContributor} type="pie"/>
    </div>
</div>


