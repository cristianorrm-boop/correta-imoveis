// ============================================
// PRIME IMÓVEIS - JAVASCRIPT
// ============================================

// ============================================
// MENU MOBILE - Toggle do menu em dispositivos móveis
// ============================================
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Abrir menu mobile
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// Fechar menu mobile
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Fechar menu ao clicar em um link
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// ============================================
// ACTIVE LINK - Destacar link ativo baseado na rolagem
// ============================================
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.nav__link[href*="${sectionId}"]`);

        if (link) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                link.classList.add('active-link');
            } else {
                link.classList.remove('active-link');
            }
        }
    });
}

window.addEventListener('scroll', scrollActive);

// ============================================
// SCROLL SUAVE - Navegação suave entre seções
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// HEADER SCROLL - Adicionar sombra ao header ao rolar
// ============================================
function scrollHeader() {
    const header = document.getElementById('header');

    if (this.scrollY >= 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    }
}

window.addEventListener('scroll', scrollHeader);

// ============================================
// FAQ ACCORDION - Expandir/Contrair perguntas frequentes
// ============================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-item__question');

    question.addEventListener('click', () => {
        // Fechar outros itens abertos (opcional - remova se quiser múltiplos abertos)
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle do item clicado
        item.classList.toggle('active');
    });
});



// ============================================
// ANIMAÇÕES AO ROLAR - Intersection Observer
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elementos para animar
const animateElements = document.querySelectorAll(`
    .servico-card,
    .imovel-card,
    .beneficio-card,
    .depoimento-card,
    .faq-item,
    .sobre__content,
    .sobre__image
`);

animateElements.forEach(el => observer.observe(el));


// ============================================
// CONTADOR ANIMADO - VERSÃO SIMPLES E FUNCIONAL
// ============================================
function iniciarContadores() {
    const contadores = document.querySelectorAll('.stat-number');
    
    contadores.forEach(contador => {
        // Pega o texto original (ex: "5000+", "98%", "+5.000")
        const textoOriginal = contador.textContent;
        
        // Extrai apenas os números
        const numeros = textoOriginal.match(/\d+/g);
        if (!numeros) return;
        
        const numeroFinal = parseInt(numeros.join(''));
        if (isNaN(numeroFinal)) return;
        
        // Extrai o símbolo (+, %, etc)
        const simbolo = textoOriginal.replace(/[\d\s]/g, '');
        
        // Verifica se o símbolo vem antes ou depois
        const simboloAntes = textoOriginal.indexOf(simbolo) === 0;
        
        // Reseta para 0
        if (simboloAntes) {
            contador.textContent = simbolo + '0';
        } else {
            contador.textContent = '0' + simbolo;
        }
        
        // Animação
        let numeroAtual = 0;
        const incremento = numeroFinal / 60; // 60 passos
        const intervalo = setInterval(() => {
            numeroAtual += incremento;
            
            if (numeroAtual >= numeroFinal) {
                // Finaliza
                if (simboloAntes) {
                    contador.textContent = simbolo + numeroFinal;
                } else {
                    contador.textContent = numeroFinal + simbolo;
                }
                clearInterval(intervalo);
            } else {
                // Atualiza
                const valorAtual = Math.floor(numeroAtual);
                if (simboloAntes) {
                    contador.textContent = simbolo + valorAtual;
                } else {
                    contador.textContent = valorAtual + simbolo;
                }
            }
        }, 30); // 30ms = ~33fps
    });
}

// Detecta quando o hero estiver visível
const observerHero = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            iniciarContadores();
            observerHero.disconnect(); // Para de observar depois que inicia
        }
    });
}, { threshold: 0.3 }); // 30% visível já inicia

// Inicia o observer
const hero = document.querySelector('.hero');
if (hero) {
    observerHero.observe(hero);
} else {
    // Se não achar .hero, tenta iniciar direto
    iniciarContadores();
}

// ============================================
// LAZY LOADING DE IMAGENS - Otimização de performance
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// FILTRO DE IMÓVEIS - Funcionalidade adicional
// ============================================
// Esta função pode ser expandida para filtrar imóveis por tipo, preço, etc.
function filterImoveis(categoria) {
    const imoveis = document.querySelectorAll('.imovel-card');

    imoveis.forEach(imovel => {
        if (categoria === 'todos' || imovel.dataset.categoria === categoria) {
            imovel.style.display = 'block';
            setTimeout(() => {
                imovel.style.opacity = '1';
                imovel.style.transform = 'scale(1)';
            }, 10);
        } else {
            imovel.style.opacity = '0';
            imovel.style.transform = 'scale(0.9)';
            setTimeout(() => {
                imovel.style.display = 'none';
            }, 300);
        }
    });
}

// ============================================
// PRELOADER - Animação de carregamento (opcional)
// ============================================
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }
});

// ============================================
// DARK MODE TOGGLE - Modo escuro (opcional)
// ============================================
// Descomente se quiser adicionar funcionalidade de dark mode
/*
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

if (darkModeToggle) {
    // Verificar preferência salva
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
    }

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}
*/

// ============================================
// ANALYTICS - Rastreamento de eventos (opcional)
// ============================================
// Adicione seu código do Google Analytics ou outro serviço aqui
/*
// Exemplo de rastreamento de cliques em botões
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const buttonText = e.target.textContent;
        console.log('Botão clicado:', buttonText);
        // gtag('event', 'click', { 'button_name': buttonText });
    });
});
*/

// ============================================
// CONSOLE MESSAGE - Mensagem para desenvolvedores
// ============================================
console.log('%c CORRETA IMÓVEIS ',
    'background: #0d0d0d; color: #1db954; font-size: 16px; padding: 10px; font-weight: bold;');
console.log('%c A escolha certa ',
    'background: #1db954; color: #0d0d0d; font-size: 12px; padding: 5px;');

// ============================================
// INICIALIZAÇÃO - Executar ao carregar a página
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Landing Page carregada com sucesso!');

    // Inicializar contadores
    scrollActive();
    toggleScrollTopButton();

    // Adicionar classe de carregamento
    document.body.classList.add('loaded');
});