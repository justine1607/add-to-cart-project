let cart = [];
    function fetchJSONData() {
        const cart = []
        fetch("data.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            const menuItemContainer = document.getElementById('menu-items');
            menuItemContainer.innerHTML = '';
            // Loop through each item using forEach
            data.forEach((item) => {
                const { id, image, name, category, price } = item;
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('item');
                itemDiv.id = `product-id-${id}`;

                const img = document.createElement('img');
                img.alt = name;
                // function to load the appropriate image based on screen width
                function loadImage() {
                    const screenWidth = window.innerWidth;

                    if (screenWidth >= 1024) {
                        img.src = image.desktop;
                    } else if (screenWidth >= 768) {
                        img.src = image.tablet;
                    } else {
                        img.src = image.mobile;
                    }
                }
                // Initial image load
                loadImage();
                // Update image on screen resize
                window.addEventListener('resize', loadImage);
                // Set the inner HTML for each item
                itemDiv.innerHTML =`
                    <div class="product-btn">
                        <span class="btn-wrapper">
                            <img class="icon-add" src="assets/images/icon-add-to-cart.svg" alt="add to cart icon">
                           <button  class="active-btn" onclick="showCart(${id}, '${image.thumbnail}', '${name}', '${category}', ${price})">Add to Cart</button>
                        </span>
                        <!-- Increment and Decrement Icons -->
                        <span class="icon-wrapper dec-wrapper" id="dec-wrapper-${id}" style="display: none;">
                            <img onclick="decrement(${id})" class="dec-svg"  src="assets/images/icon-decrement-quantity.svg" alt="decrement-icon">
                        </span>
                        <span class="icon-wrapper inc-wrapper" id="inc-wrapper-${id}" style="display: none;">
                            <img onclick="increment(${id})" class="inc-svg" src="assets/images/icon-increment-quantity.svg" alt="increment-icon">
                        </span>
                    </div>
                    <div class="text-container">
                        <p>${category}</p>
                        <h2>${name}</h2>
                        <p class="product-price">$${price.toFixed(2)}</p>
                    </div>`;

                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                imageContainer.appendChild(img);
                itemDiv.prepend(imageContainer);
                menuItemContainer.appendChild(itemDiv);
            });
        })
        .catch((error) => {
            console.error("Unable to fetch data:", error);
        });
    }
    const showCart = (id, image, name, category, price) => {
        const imageBorder = document.querySelector(`#product-id-${id} .image-container img`);
        imageBorder.classList.add('active-img')
        const quantityElement = document.querySelector(`#product-id-${id} button`);
        quantityElement.innerText = 1;
        // Check if the item is already in the cart
        const search = cart.find((x) => x.id === id);
        if (search === undefined) {
            // Add a new item to the cart with a starting quantity of 1
            cart.push({
                id: id,
                image: image,
                name: name,
                category: category,
                price: price,
                quantity: 1
            });
        }
        const btnWrapper = document.querySelector(`#product-id-${id} .icon-add`);
        btnWrapper.style.display = 'none';
        const productBtn = document.querySelector(`#product-id-${id} .product-btn`);
        productBtn.classList.add('active');
        const decButton = document.querySelector(`#product-id-${id} .icon-wrapper`);
        decButton.style.display = 'inline-flex';
        const incButton = document.querySelector(`#product-id-${id} .inc-wrapper`);
        incButton.style.display = 'inline-flex';
        updateCart();
    };
    const increment = (id, image, name, category, price) => {
        const search = cart.find((x) => x.id === id);

        if (search === undefined) {
            // If item not found, call showCart to add it and set quantity to 1
            showCart(id, image, name, category, price);
        } else {
            // If the item is found in the cart, increment its quantity
            search.quantity += 1;
            // Update the quantity displayed in the UI
            const quantityElement = document.querySelector(`#product-id-${id} button`);
            quantityElement.innerText = search.quantity; // Display the updated quantity
            updateCart();
        }
    };
    const decrement = (id) => {
        const imageBorder = document.querySelector(`#product-id-${id} .image-container img`);
        const search = cart.find((x) => x.id === id);
        if (search) {
            // If quantity is more than 1, just decrement
            if (search.quantity > 1) {
                search.quantity -= 1;
                const quantityElement = document.querySelector(`#product-id-${id} button`);
                quantityElement.innerText = search.quantity;
            } else {
                // If quantity is 1, remove the item from the cart
                imageBorder.classList.remove('active-img');//then we remove its class name when the quantity is 1
                cart = cart.filter((item) => item.id !== id);
                const quantityElement = document.querySelector(`#product-id-${id} button`);
                quantityElement.innerText = 'Add to Cart'; // Reset button text
                const productBtn = document.querySelector(`#product-id-${id} .product-btn`);
                productBtn.classList.remove('active');
                const btnWrapper = document.querySelector(`#product-id-${id} .icon-add`);
                btnWrapper.style.display = 'block';
                const decButton = document.querySelector(`#product-id-${id} .icon-wrapper`);
                decButton.style.display = 'none';
                const incButton = document.querySelector(`#product-id-${id} .inc-wrapper`);
                incButton.style.display = 'none';
            }
            updateCart();
        }
    };
    const updateCart = () => {
        const updateCartItems = document.getElementById('cart');
        const emptyCart = document.querySelector('.empty-cart');
        const totalElement = document.getElementById('total-price');
        const carbonElement = document.querySelector('.carbon-text');
        const ctaElement = document.querySelector('.cta-confirm');
        const yourCart = document.getElementById('your-cart');

        // Clear the current cart display
        updateCartItems.innerHTML = '';

        // Check if cart has items
        if (cart.length === 0) {
            // If the cart is empty, show the empty-cart message and hide the rest
            emptyCart.style.display = 'block';
            totalElement.style.display = 'none';
            carbonElement.style.display = 'none';
            ctaElement.style.display = 'none';
            yourCart.innerText = 'Your Cart (0)';
        } else {
            // If the cart has items, hide the empty-cart message
            emptyCart.style.display = 'none';
            totalElement.style.display = 'flex';
            carbonElement.style.display = 'flex';
            ctaElement.style.display = 'block';

            // Update total quantity in cart
            const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
            yourCart.innerText = `Your Cart (${totalQuantity})`;
        }
        // Loop through each item in the cart to display it
        cart.forEach((item) => {
            const {id} = item;
            // Create a new div element for each cart item
            const cartItemDiv = document.createElement('div');
            cartItemDiv.classList.add('item'); // Add a class for styling
            cartItemDiv.innerHTML = `
            <div class="item-wrapper">
            <p class="container-name">${item.name}</p>
            <div class="price-wrapper">
                <p class="product-quantity">x<span>${item.quantity}</span></p>
                <p class="cart-item-price">@$${item.price.toFixed(2)}<span class="total-quantity"> $${(item.price * item.quantity).toFixed(2)}</span></p>
            </div>
            </div>
            <img onclick="removeItem(${id})" class="remove-icon" src="assets/images/icon-remove-item.svg" alt="remove-icon">
            `;
            updateCartItems.appendChild(cartItemDiv);
        });
        // Update total price
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        totalElement.innerHTML = `Order Total: <span class="total-price">$${totalPrice.toFixed(2)}</span>`;
    };
    const removeItem = (id) =>{
        //find the id that corresponds to your selection
        let selectedItem = cart.find((x) => x.id === id);
        //if it finds then execute the block inside
        if (selectedItem){
            console.log('item remove', selectedItem.id);
            //this filtered agent x is targeting all id in whichever we click on the remove button it will remove from the cart
            cart = cart.filter((x) => x.id !== selectedItem.id );
            const imageBorder = document.querySelector(`#product-id-${id} .image-container img`);
            imageBorder.style.border = 'none';
            const quantityElement = document.querySelector(`#product-id-${id} button`);
            quantityElement.innerText = 'Add to Cart'; // Reset button text
            const productBtn = document.querySelector(`#product-id-${id} .product-btn`);
            productBtn.classList.remove('active');
            const btnWrapper = document.querySelector(`#product-id-${id} .icon-add`);
            btnWrapper.style.display = 'block';
            const decButton = document.querySelector(`#product-id-${id} .icon-wrapper`);
            decButton.style.display = 'none';
            const incButton = document.querySelector(`#product-id-${id} .inc-wrapper`);
            incButton.style.display = 'none';
        }
        updateCart();
    }
    const showModal = () => {
        const modalContainer = document.getElementById('modal-container');
        const modalCart = document.getElementById('cart-modal');
        modalCart.classList.add('active-modal');
        const modalItems = document.getElementById('modal-items');
        const modalTotal = document.getElementById('modal-total');
        const modalCta = document.getElementById('cta-modal');

        modalItems.innerHTML = '';

        cart.forEach((item) => {
            const { id, image, name, quantity, price } = item;
            // Create a new div element for each cart item
            const modalCartItemDiv = document.createElement('div');
            modalCartItemDiv.classList.add('modal-item');
            // Set the inner HTML for each item
            modalCartItemDiv.innerHTML = `
                <div class="modal-img-container">
                   <img src=${image} alt=${name} class="thumbnail-img"> 
                <div class="text-wrapper">
                 <p class="modal-name">${name}</p>
                    <div class="price-wrapper">
                        <p class="product-quantity"><span>${quantity}</span>x</p>
                         <div class="modal-item-price">@$${price.toFixed(2)}</div>
                    </div>
                </div>
                <span class="total-quantity"> $${(price * quantity).toFixed(2)}</span>    
            </div>
`;
            modalItems.appendChild(modalCartItemDiv);
        });
        const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        modalTotal.innerHTML = `Order Total: <span class="total-price">$${totalPrice.toFixed(2)}</span>`;

        modalItems.appendChild(modalTotal);

        modalContainer.style.display = 'block';
        modalCart.style.display = 'block';
        modalCta.style.display = 'block';

    };
const closeModal = (id) => {
    const modalCart = document.getElementById('modal-container');
    modalCart.style.display = 'none';
};
const modalContainer = document.getElementById('modal-container');
modalContainer.addEventListener('click', closeModal); // Close modal on clicking outside
const newOrder = () =>{
    alert('order submitted! thank you for ordering :)');
    location.reload();
}

fetchJSONData();