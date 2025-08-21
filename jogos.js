// Dropdowns
const dropdownConsoles = document.getElementById("myDropdownConsoles");
const dropdownJogos = document.getElementById("myDropdownJogos");
const buttonConsoles = document.querySelector(".dropdown .dropbtn:first-child"); // Botão "Consoles"
const buttonJogos = document.querySelectorAll(".dropdown .dropbtn")[1]; // Botão "Jogos"

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
        !dropdownConsoles.contains(event.target) &&
        !buttonConsoles.contains(event.target)
    ) {
        dropdownConsoles.classList.remove("show");
    }
    if (
        dropdownJogos &&
        !dropdownJogos.contains(event.target) &&
        !buttonJogos.contains(event.target)
    ) {
        dropdownJogos.classList.remove("show");
    }
};


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

// Função para filtrar os jogos com base no tipo
async function filterGames(type) {
    const products = await loadProducts();

    
    const productArray = Object.keys(products).map(key => ({
        id: key,
        ...products[key]
    }));

    const filteredProducts = productArray.filter(product => {
        if (type === "all") return product.category === "jogos"; // Todos os jogos
        return product.category === "jogos" && product.type === type; // De Mesa ou Portáteis
    });

    const productContainer = document.querySelector(".products .product-item");
    productContainer.innerHTML = ""; 

    filteredProducts.forEach(product => {
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

document.addEventListener("DOMContentLoaded", () => {
    const dropdownLinks = document.querySelectorAll("#myDropdownJogos a");

    dropdownLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); 
            const type = link.getAttribute("data-type"); 
            filterGames(type); 
        });
    });

    filterGames("all");
});

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

// Função para filtrar e exibir jogos por tipo e preço
async function filterGames(type, sortOrder) {
    const products = await loadProducts();

    
    const productArray = Object.keys(products).map(key => ({
        id: key,
        ...products[key]
    }));

    // Filtra os produtos pela categoria e tipo
    let filteredProducts = productArray.filter(product => {
        if (type === "all") return product.category === "jogos"; 
        return product.category === "jogos" && product.type === type; 
    });

    // Ordena os produtos filtrados pelo preço
    if (sortOrder === "low-to-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high-to-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Atualiza o DOM com os produtos filtrados
    const productContainer = document.querySelector(".products .product-item");
    productContainer.innerHTML = ""; // Limpa os produtos atuais

    filteredProducts.forEach(product => {
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

// Inicializa os eventos de filtro
document.addEventListener("DOMContentLoaded", () => {
    const dropdownLinks = document.querySelectorAll("#myDropdownJogos a");
    const priceRange = document.getElementById("price-range");

    let currentType = "all"; 
    let currentSortOrder = "low-to-high"; 

    // Evento de clique no dropdown de tipo
    dropdownLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); 
            currentType = link.getAttribute("data-type"); 
            filterGames(currentType, currentSortOrder); 
        });
    });

    // Evento de mudança no filtro de preço
    priceRange.addEventListener("change", (event) => {
        currentSortOrder = event.target.value; 
        filterGames(currentType, currentSortOrder); 
    });

    // Exibe todos os jogos inicialmente ao carregar a página
    filterGames(currentType, currentSortOrder);
});

// Atualiza o texto da seção com base no filtro selecionado
function updateSectionInfo(type) {
    const sectionSpan = document.getElementById("current-section");
    let sectionText = "Jogos"; // Valor padrão

    if (type === "mesa") {
        sectionText = "Jogos de Mesa";
    } else if (type === "portatil") {
        sectionText = "Jogos Portáteis";
    }

    sectionSpan.textContent = sectionText; 
}

// Adiciona o evento para atualizar a seção ao clicar nos filtros
document.addEventListener("DOMContentLoaded", () => {
    const dropdownLinks = document.querySelectorAll("#myDropdownJogos a");

    dropdownLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const filterType = link.getAttribute("data-type");
            updateSectionInfo(filterType); 
        });
    });

    updateSectionInfo("all");
});

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

        profileLink.textContent = loggedInUser ? "Perfil" : "Perfil";
        profileLink.href = loggedInUser ? "userprofile.html" : "login.html";
    }
}

// Chama a função ao carregar a página do perfil
document.addEventListener("DOMContentLoaded", updateProfileLink);

