// selecting element
const searchText = document.getElementById('searchText')
const searchBtn = document.getElementById('searchBtn')
const container = document.getElementById('product-container')

const totalProductElement = document.getElementById('totalProduct')
const priceElement = document.getElementById('price')
const deliveryCostElement = document.getElementById('delivery-cost')
const taxElement = document.getElementById('tax')
const totalPriceElement = document.getElementById('totalPrice')
const detailsContainer = document.getElementById('details-container')



function loadData() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => showData(data))
}
loadData()

searchBtn.addEventListener('click', () => {
    const searchValue = ((searchText.value).toLowerCase()).trim();
    searchText.value = ''
    const api = `https://fakestoreapi.com/products/category/${searchValue}`
    fetch(api)
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                showData(data)
            } else {
                alert('woops! Please search with a valid Category name')
            }
        })
})

function showData(data) {
    container.innerHTML = ''
    data.forEach(product => {
        let count = 0
        let stars = ''
        let stop = 0
        const rating = product.rating.rate;
        for (let i = 0; i < 5; i++) {
            if (Math.floor(rating) > count) {
                stars += '<i class = "fas fa-star"></i>'
                count++
            } else if (rating + ''.includes('.') && stop == 0) {
                stars += "<i class='fas fa-star-half-alt'></i>"
                stop++
            } else {
                stars += '<i class="far fa-star"></i>'
            }
        }

        const div = document.createElement('div')
        div.innerHTML = `
       <div class="col">
       <div style="min-height:450px" class="card h-100">
           <div class="product-image">
               <img style='height:200px' src="${product.image}" class="card-img-top"
                   alt="...">
           </div>
           <div class="card-body text-black text-center">
               <h5 class="card-title text-info">${product.title.slice(0,20)}</h5>
               <h4 class="text-center">Price: $ ${product.price}</h4>
               <p class="card-text text-capitalize"><b>Category: ${product.category}</b></p>
               <p class="card-text">
                   <b>Ratings:
                       ${stars}
                       <span>${product.rating.rate}</span>
                   </b>
               </p>
               <p>
                   <b>
                       Total Review: <i class="fas text-dark fa-user-tie"></i>
                       <span>${product.rating.count}</span>
                   </b>
               </p>

           </div>
           <div class="card-footer d-flex justify-content-around">
               <button onclick='addToCart(${product.price})' class='btn btn-primary'>Add to cart</button>
               <button onclick='details(${product.id})' type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
           </div>
       </div>
   </div>`
        container.appendChild(div)

    })

}

function addToCart(price) {
    // update price
    const previousPrice = getValue('price')
    priceElement.innerText = (previousPrice + price).toFixed(2);
    // update quantity
    const previousQuantity = getValue('totalProduct')
    totalProductElement.innerText = previousQuantity + 1;
    taxAndDeliveryUpdate()
    totalPriceUpdate()
}

function taxAndDeliveryUpdate() {
    const currentPrice = getValue('price')
    if (currentPrice >= 200 && currentPrice < 400) {

        deliveryCostElement.innerText = 30;
        const tax = (currentPrice / 100) * 20;
        taxElement.innerText = tax.toFixed(2)

    } else if (currentPrice >= 400 && currentPrice < 500) {

        deliveryCostElement.innerText = 50;
        const tax = (currentPrice / 100) * 30;
        taxElement.innerText = tax.toFixed(2)

    } else if (currentPrice >= 500) {

        deliveryCostElement.innerText = 60;
        const tax = (currentPrice / 100) * 40;
        taxElement.innerText = tax.toFixed(2)
    }
}

function getValue(id) {
    const value = document.getElementById(id).innerText;
    return Number(value)
}

function totalPriceUpdate() {
    const total = getValue('price') + getValue('delivery-cost') + getValue('tax')
    totalPriceElement.innerText = total.toFixed(2);
}

function purchase() {
    totalProductElement.innerText = 0;
    priceElement.innerText = 0;
    deliveryCostElement.innerText = 0;
    taxElement.innerText = 0;
    totalPriceElement.innerText = 0;
}

function details(id) {
    const api = `https://fakestoreapi.com/products/${id}`
    fetch(api)
        .then(res => res.json())
        .then(product => {
            let count = 0
            let stars = ''
            let stop = 0
            const rating = product.rating.rate;
            for (let i = 0; i < 5; i++) {
                if (Math.floor(rating) > count) {
                    stars += '<i class = "fas fa-star"></i>'
                    count++
                } else if (rating + ''.includes('.') && stop == 0) {
                    stars += "<i class='fas fa-star-half-alt'></i>"
                    stop++
                } else {
                    stars += '<i class="far fa-star"></i>'
                }
            }
            const div = document.createElement('div')
            div.innerHTML = `
            <div class="col">
            <div style="min-height:auto" class="card h-100">
                <div class="product-image">
                    <img style='max-height:200px' src="${product.image}" class="card-img-top"
                        alt="...">
                </div>
                <div class="card-body text-black text-center">
                    <h5 class="card-title text-info">${product.title}</h5>
                    <h4 class="text-center">Price: $ ${product.price}</h4>
                    <p class="card-text text-capitalize"><b>Category: ${product.category}</b></p>
                    <p class="card-text">
                        <b>Ratings:
                            ${stars}
                            <span>${product.rating.rate}</span>
                        </b>
                    </p>
                    <p>
                        <b>
                            Total Review: <i class="fas text-dark fa-user-tie"></i>
                            <span>${product.rating.count}</span>
                        </b>
                    </p>
     
                </div>
            </div>
        </div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button onclick='addToCart(${product.price})' class='btn btn-primary'>Add to cart</button>
      </div>
        
        `
            detailsContainer.innerHTML = ''
            detailsContainer.appendChild(div)
        })
}