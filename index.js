const Airtable = require("airtable")
const tableEnteries = [];
const loadMoreBtn = document.querySelector('.load-more');
const loadLessBtn = document.querySelector('.load-less');
const NUM_OF_APPS_TO_SHOW = 3

let currentTableEnteries = []
// API_KEY = keyhkJ5VgWbTwmG3q


const hide = (element) => element.classList.add('hidden')
const show = (element) => element.classList.remove('hidden')


// polygon ecosystem table id - tblJ0nraleEpoEtbX

var base = new Airtable({apiKey: 'keyhkJ5VgWbTwmG3q'}).base('appFluzqFtbgD7sVH');
const mountSlide = () => {
    return new Promise((resolve) => {
        var splide = new Splide( '.splide', {
            perPage: 5,
            rewind : false,
            autoWidth: true,
            gap : 20,
            padding : { left : 50, right : 50}
        });
          
        splide.mount();
        resolve()
    })
}

// loadMoreBtn.addEventListener('click', () => {
//     renderAppList(currentTableEnteries, true)
//     hide(loadMoreBtn)
//     show(loadLessBtn)
// })

// loadLessBtn.addEventListener('click', () => {
//     renderAppList(currentTableEnteries, false)
//     show(loadMoreBtn)
//     hide(loadLessBtn)
// })

const filterAppsList = (categoryName) => {
    
    if(categoryName === "All Dapps") {
        // render all elements
        currentTableEnteries = [...tableEnteries]
        renderAppList(currentTableEnteries, false)
        return
    }

    const filteredApps = tableEnteries.filter((entry) => entry.categories.includes(categoryName))
    currentTableEnteries = [...filteredApps]
    renderAppList(currentTableEnteries, false)

}
const addClickListenerToCategory = () => {
    const categories = document.querySelectorAll('.splide__slide');
    
    categories.forEach((category) => {
        category.addEventListener('click', () => {
            filterAppsList(category.innerHTML)
        })
    })
}

const renderCategories = (items) => {
    
    const ul = document.createElement('ul');

    items.forEach((item) => ul.innerHTML += `<li class='splide__slide'>${item}</li>` )

    document.querySelector('.splide__list').innerHTML = ul.innerHTML
    
    mountSlide().then(() => addClickListenerToCategory())
}

    

const renderAppList = (apps, loadMore = false) => {
    // resetting all apps list
    document.querySelector('.apps').innerHTML = ''

    if(apps.length < NUM_OF_APPS_TO_SHOW + 1) {
        hide(loadLessBtn)
        hide(loadMoreBtn)
    } else {
        show(loadMoreBtn)
    }

    const appsToRender = loadMore ? apps : apps.slice(0,NUM_OF_APPS_TO_SHOW)

    appsToRender.forEach((app) => {
        const overview = `<div class="web3-applist_card-component">
            <h4 class="text-weight-medium">${app.name}</h4>
            <p class="text-style-5lines text-color-grey7">${app.description}</p>

            <a target="_blank" href=${app.link}>Read More</a>
        </div>`

        let div = document.createElement('div')
        div.classList.add('web3-applist_tag-wrapper')
        app.categories.forEach((item) => {
            div.innerHTML += `<div class='web3-applist_tag'>${item}</div>`
        })

        
        const newApp = `<div class='app'>
            <div class="app-logo-categories">
                <img class="app-logo" src="/sample-logo.png" alt="" srcset="">

                <ul>${div.innerHTML}</ul>
            </div>

            ${overview}

        </div>`

        document.querySelector('.web3-applist_component').innerHTML += newApp

    })

    
}

const getAllCategoryList = (entries) => {
    const arr = []

    entries.forEach(entry => {
        entry.categories.forEach((item) => {
            arr.push(item)
        })

    })
    // removing duplicates
    const uniqueCategories = new Set(["All Dapps",...arr])
    return uniqueCategories
}

base('Polygon Ecosystem').select({
    // Selecting the first 3 records in Grid view:
    maxRecords : 5,
    view: "Grid view"
}).eachPage(function page(records, fetchNextPage) {
    // This function (`page`) will get called for each page of records.
    records.forEach(function(record) {
        // console.log("retreived", record.fields);
        const entry = {
            name : record.get("Name"),
            categories : record.get("Category"),
            databaseId : record.get("Database Id"),
            logos : record.get("Logo"),
            email : record.get("Email Address"),
            description : record.get("Description"),
            link : record.get("Website")
            
        }

        tableEnteries.push(entry)
    });

    // To fetch the next page of records, call `fetchNextPage`.
    // If there are more records, `page` will get called again.
    // If there are no more records, `done` will get called.

    fetchNextPage();

}, function done(err) {

    const categories = getAllCategoryList(tableEnteries)
    // invoke function to render categories;
    currentTableEnteries = [...tableEnteries]
    renderAppList(tableEnteries, false)
    show(loadMoreBtn)

    renderCategories(categories)
    if (err) { console.error(err); return; }
});