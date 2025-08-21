// Dropdowns
const dropdownConsoles = document.getElementById("myDropdownConsoles");
const dropdownJogos = document.getElementById("myDropdownJogos");
const buttonConsoles = document.querySelector(".dropdown .dropbtn");
const buttonJogos = document.querySelector(".dropdown .dropbtnJogos");

function toggleDropdown(dropdown) {
    if (dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Ao clicar no botão "Consoles"
if (buttonConsoles) {
    buttonConsoles.onclick = function (event) {
        event.stopPropagation(); 

        if (dropdownJogos.classList.contains("show")) {
            dropdownJogos.classList.remove("show");
        }
        toggleDropdown(dropdownConsoles); 
    };
}

// Ao clicar no botão "Jogos"
if (buttonJogos) {
    buttonJogos.onclick = function (event) {
        event.stopPropagation(); 
        
        if (dropdownConsoles.classList.contains("show")) {
            dropdownConsoles.classList.remove("show");
        }
        toggleDropdown(dropdownJogos); 
    };
}

// Fechar dropdowns quando clicar fora
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


let currentConsoleType = "all";


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

// Função para filtrar e exibir os consoles com base no tipo e ordem de preço
async function filterConsoles(type = "all", sortOrder = "low-to-high") {
    const products = await loadProducts();

    // Filtra os produtos com base na categoria e tipo
    const filteredProducts = Object.keys(products)
        .map(key => ({ id: key, ...products[key] }))
        .filter(product => {
            if (product.category !== "consoles") return false;
            if (type === "all") return true;
            return product.type && product.type.toLowerCase() === type;
        });

    // Ordena os produtos filtrados com base no preço
    const sortedProducts = filteredProducts.sort((a, b) => {
        return sortOrder === "low-to-high" ? a.price - b.price : b.price - a.price;
    });

   
    const productContainer = document.querySelector(".products .product-item");
    if (!productContainer) return;

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

// Adiciona eventos de clique nos links do dropdown para filtrar por tipo
document.addEventListener("DOMContentLoaded", () => {
    const dropdownLinks = document.querySelectorAll("#myDropdownConsoles a");

    dropdownLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault(); 
            currentConsoleType = link.getAttribute("data-type") || "all"; 
            const sortOrder = document.getElementById("price-range").value; 
            filterConsoles(currentConsoleType, sortOrder); 
        });
    });

    
    document.getElementById("price-range").addEventListener("change", (event) => {
        const sortOrder = event.target.value;
        filterConsoles(currentConsoleType, sortOrder); 
    });

    filterConsoles(currentConsoleType, "low-to-high");
});

function updateConsoleSectionInfo(type) {
    const sectionSpan = document.getElementById("current-section-consoles");
    let sectionText = "Todos os Consoles"; 

    if (type === "mesa") {
        sectionText = "Consoles de Mesa";
    } else if (type === "portatil") {
        sectionText = "Consoles Portáteis";
    }

    sectionSpan.textContent = sectionText; 
}

// Adiciona o evento para atualizar a seção ao clicar nos filtros
document.addEventListener("DOMContentLoaded", () => {
    const dropdownLinks = document.querySelectorAll("#myDropdownConsoles a");

    dropdownLinks.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const filterType = link.getAttribute("data-type");
            updateConsoleSectionInfo(filterType); 
        });
    });

    updateConsoleSectionInfo("all");
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

document.addEventListener("DOMContentLoaded", updateProfileLink);

