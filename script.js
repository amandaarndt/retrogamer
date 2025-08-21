// Dropdowns
const dropdownConsoles = document.getElementById("myDropdownConsoles");
const dropdownJogos = document.getElementById("myDropdownJogos");
const buttonConsoles = document.querySelector(".dropdown .dropbtn");
const buttonJogos = document.querySelector(".dropdown .dropbtnJogos");

function toggleDropdown(dropdown) {
    if (dropdown) dropdown.classList.toggle("show");
}

if (buttonConsoles) {
    buttonConsoles.onclick = function (event) {
        event.stopPropagation();
        toggleDropdown(dropdownConsoles);
    };
}

if (buttonJogos) {
    buttonJogos.onclick = function (event) {
        event.stopPropagation();
        toggleDropdown(dropdownJogos);
    };
}

window.onclick = function (event) {
    if (
        dropdownConsoles &&
        buttonConsoles &&
        !dropdownConsoles.contains(event.target) &&
        !buttonConsoles.contains(event.target)
    ) {
        dropdownConsoles.classList.remove("show");
    }
    if (
        dropdownJogos &&
        buttonJogos &&
        !dropdownJogos.contains(event.target) &&
        !buttonJogos.contains(event.target)
    ) {
        dropdownJogos.classList.remove("show");
    }
};

// Detalhes dos produtos
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
// Por conta da restrição de segurança dos navegadores, necessita-se usar a extensão "Live Server" no VSCode para exibir os produtos

function loadProductDetails() {
    const productId = getProductIdFromURL();

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            if (products[productId]) {
                const product = products[productId];

                
                document.getElementById('main-image').src = product.mainImage || 'assets/default.jpg';
                document.getElementById('product-name').textContent = product.name || 'Produto não disponível';
                document.getElementById('product-data').textContent = product.data || 'Data não informada';
                document.getElementById('product-price').textContent = `R$ ${product.price?.toFixed(2) || '0.00'}`;
                document.getElementById('product-description').textContent = product.description || 'Descrição não disponível';
                document.getElementById('product-condition').textContent = product.condition || 'Condição não informada';
                document.getElementById('product-warranty').textContent = product.warranty || 'Garantia não informada';
                document.getElementById('product-type').textContent = product.type || 'Tipo não informado';

               
                const linkElement = document.getElementById('product-link');
                if (linkElement && product.link) {
                    linkElement.href = product.link;
                    linkElement.textContent = 'Ver no site';
                    linkElement.target = '_blank'; 
                }

                // Adicionar ao carrinho
                const cartButton = document.getElementById('cart-button');
                if (cartButton) {
                    cartButton.addEventListener('click', function () {
                        addToCart(product);
                    });
                }
            } else {
                document.querySelector('.product-detail-container').innerHTML = "<p>Produto não encontrado!</p>";
            }
        })
        .catch(error => {
            console.error("Erro ao carregar detalhes do produto:", error);
            document.querySelector('.product-detail-container').innerHTML = "<p>Erro ao carregar os detalhes do produto!</p>";
        });
}


document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname.endsWith("productdetail.html")) {
        loadProductDetails();
    }
});


// Carrinho
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Função para adicionar produtos ao carrinho
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    
    const existingProductIndex = cart.findIndex(item => item.name === product.name); 

    if (existingProductIndex === -1) {
        
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart)); 
        alert("Produto adicionado ao carrinho!");
    }
}


// Renderiza os itens no carrinho
function renderCart() {
    const cartContainer = document.getElementById("cart-items-container");
    const cart = getCart();

    if (!cartContainer) return;

    cartContainer.innerHTML = ""; // Limpa o conteúdo

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Seu carrinho está vazio!</p>";
    } else {
        let total = 0;
        cart.forEach((product, index) => {
            total += product.price * product.quantity;
            const productElement = document.createElement("div");
            productElement.classList.add("cart-item");
            productElement.innerHTML = `
                <img src="${product.mainImage}" alt="${product.name}" class="cart-item-image" />
                <div>
                    <a href="productdetail.html?id=${product.id}">
                        <h3 >${product.name}</h3>
                    </a>
                    <p class="product-name-cart">Preço: R$ ${product.price.toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${index})">Remover</button>
                </div>
            `;
            cartContainer.appendChild(productElement);
        });

       
    }
}


// Função para remover item do carrinho
function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1); 
    saveCart(cart);
    renderCart(); 
}

// Função para limpar o carrinho
function clearCart() {
    saveCart([]); 
    renderCart(); 
}

document.addEventListener('DOMContentLoaded', renderCart); 

// Registro de usuário
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("user_id").value;
        const password = document.getElementById("password_id").value;

        if (localStorage.getItem(username)) {
            alert("Usuário já registrado!");
        } else {
            const userData = { username, password };
            localStorage.setItem(username, JSON.stringify(userData));
            alert("Usuário registrado com sucesso!");
        }
    });
}

// Login de usuário
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const username = document.getElementById("user_id").value;
        const password = document.getElementById("password_id").value;

        const storedUser = localStorage.getItem(username);
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            if (userData.password === password) {
                alert("Login bem-sucedido!");
                sessionStorage.setItem("loggedInUser", username);
                window.location.href = "userprofile.html";
            } else {
                alert("Senha incorreta!");
            }
        } else {
            alert("Usuário não encontrado!");
        }
    });
}

// Carregamento do perfil
if (window.location.pathname.endsWith("userprofile.html")) {
    window.onload = function () {
        const userProfile = document.getElementById("userProfile");
        const username = sessionStorage.getItem("loggedInUser");

        if (userProfile && username) {
            const storedUser = localStorage.getItem(username);
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userProfile.innerHTML = `<h2>Bem-vindo, ${userData.username}!</h2>`;
            } else {
                alert("Usuário não encontrado!");
            }
        }
    };
}

// Verifica se há usuário logado
const loggedInUser = sessionStorage.getItem('loggedInUser');
if (loggedInUser) {
    const userProfile = document.getElementById('userProfile');
    if (userProfile) {
        userProfile.innerHTML = `
            <h2>Bem-vindo, ${loggedInUser}!</h2>
            <button id="logoutButton">Sair</button>
        `;

        const logoutButton = document.getElementById('logoutButton');
        logoutButton.addEventListener('click', function () {
            sessionStorage.removeItem('loggedInUser');
            alert('Você saiu da sua conta.');
            window.location.href = 'login.html';
        });
    }
}

// Verifica se o usuário está logado e ajusta o comportamento do link de perfil
function updateProfileLink() {
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    const profileLink = document.getElementById("profile-link");

    if (profileLink) {
        profileLink.addEventListener("click", function (event) {
            if (!loggedInUser) {
                event.preventDefault(); 
                alert("Você precisa estar logado para acessar o perfil.");
                window.location.href = "login.html"; 
            }
        });

        // Atualiza o texto do link
        profileLink.textContent = loggedInUser ? "Perfil" : "Perfil";
        profileLink.href = loggedInUser ? "userprofile.html" : "login.html";
    }
}

document.addEventListener("DOMContentLoaded", updateProfileLink);



// Função para carregar os produtos do arquivo JSON
async function loadProducts() {
    try {
        const response = await fetch("products.json");
        if (!response.ok) throw new Error("Erro ao carregar o JSON");
        const products = await response.json();
        return products;
    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        return {};
    }
}

// Função para filtrar e exibir os produtos
async function filterProducts(sortOrder) {
    const products = await loadProducts();

    const productArray = Object.keys(products).map(key => ({
        id: key,
        ...products[key]
    }));

    // Ordena os produtos com base no preço
    const sortedProducts = productArray.sort((a, b) => {
        if (sortOrder === "low-to-high") {
            return a.price - b.price;
        } else if (sortOrder === "high-to-low") {
            return b.price - a.price;
        }
        return 0;
    });

    
    const productContainer = document.querySelector(".product-item");
    productContainer.innerHTML = ""; 

    sortedProducts.forEach(product => {
        const productCard = `
            <div class="product-card">
                <a href="productdetail.html?id=${product.id}">
                    <img src="${product.mainImage}" alt="${product.name}" class="product-image">
                    <div class="product-description">
                        <h3>${product.name}</h3>
                        <p><strong>R$ ${product.price.toFixed(2).replace(".", ",")}</strong></p>
                    </div>
                </a>
            </div>
        `;
        productContainer.insertAdjacentHTML("beforeend", productCard);
    });
}

// Adiciona o evento de mudança ao filtro de preço
document.getElementById("price-range").addEventListener("change", (event) => {
    const sortOrder = event.target.value;
    filterProducts(sortOrder);
});

// Aplica o filtro padrão ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    filterProducts("low-to-high"); 
});


