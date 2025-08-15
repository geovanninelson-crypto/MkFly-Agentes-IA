// Navigation scroll effect
const nav = document.querySelector('nav');
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Mobile navigation toggle
if (burger) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
        if (burger) burger.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission with validation and n8n integration
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const nombre = document.getElementById('nombre').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        
        if (!nombre || !empresa || !correo || !telefono || !mensaje) {
            alert('Por favor, complete todos los campos del formulario.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }
        
        // Phone validation (basic)
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(telefono)) {
            alert('Por favor, ingrese un número de teléfono válido.');
            return;
        }
        
        // Collect form data with the exact keys your n8n workflow expects
        const formData = {
            nombre: nombre,
            empresa: empresa,
            correo: correo,
            telefono: telefono,
            mensaje: mensaje,
            // Puedes agregar otros campos si tu webhook los necesita
            // tipo: 'formulario_contacto',
            // timestamp: new Date().toISOString(),
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Send form data to n8n webhook
        sendFormToN8n(formData)
            .then(() => {
                // Reset form on success
                contactForm.reset();
                alert('¡Gracias por contactarnos! Hemos recibido su mensaje y nos comunicaremos con usted a la brevedad.');
            })
            .catch((error) => {
                console.error('Error al enviar formulario:', error);
                alert('Hubo un problema al enviar su mensaje: ' + error.message);
            })
            .finally(() => {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
    
} else {
    console.error('No se encontró el formulario de contacto con ID "contact-form"');
}

// Function to send form data to n8n webhook
async function sendFormToN8n(data) {
    console.log('=== ENVIANDO FORMULARIO A N8N ===');
    
    try {
        // 🎯 AQUÍ PONES LA URL DE TU WEBHOOK DE N8N 🎯
        const webhookUrl = 'https://geovas.app.n8n.cloud/webhook/Mkfly';
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        if (response.ok) {
            console.log('✅ Formulario enviado exitosamente a n8n.');
            return { success: true, message: 'Formulario enviado correctamente' };
        } else {
            const errorText = await response.text();
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
        }
    } catch (error) {
        console.error('❌ Error al enviar el formulario a n8n:', error);
        throw error;
    }
}

// Animation on scroll for service cards
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .contact-form, .contact-info');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== INICIALIZANDO MKFLY AI AGENTS ===');
    
    // Set initial styles for animation
    const elements = document.querySelectorAll('.service-card, .contact-form, .contact-info');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // Trigger animation for elements in view on page load
    animateOnScroll();
    
    // Verify critical elements exist
    const criticalElements = {
        contactForm: document.getElementById('contact-form'),
        nombreField: document.getElementById('nombre'),
        empresaField: document.getElementById('empresa'),
        correoField: document.getElementById('correo'),
        telefonoField: document.getElementById('telefono'),
        mensajeField: document.getElementById('mensaje')
    };
    
    const missingElements = Object.entries(criticalElements)
        .filter(([key, element]) => !element)
        .map(([key]) => key);
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos faltantes en el HTML:', missingElements);
    } else {
        console.log('✅ Todos los elementos del formulario están presentes');
    }
    
    console.log('=== INICIALIZACIÓN COMPLETA ===');
});

// Listen for scroll to trigger animations
window.addEventListener('scroll', animateOnScroll);

// Add some utility functions for debugging
window.debugFormData = function() {
    const form = document.getElementById('contact-form');
    if (form) {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        console.log('Current form data:', data);
    } else {
        console.error('Form not found');
    }
};

// Test webhook connectivity
window.testWebhook = async function() {
    console.log('Testing webhook connectivity...');
    
    const testData = {
        nombre: 'Test User',
        empresa: 'Test Company',
        correo: 'test@example.com',
        telefono: '+1234567890',
        mensaje: 'This is a test message',
        tipo: 'test',
        timestamp: new Date().toISOString()
    };
    
    try {
        const result = await sendFormToN8n(testData);
        console.log('✅ Webhook test successful:', result);
        alert('Test exitoso: La conexión con n8n está funcionando correctamente.');
    } catch (error) {
        console.error('❌ Webhook test failed:', error);
        alert('Test fallido: ' + error.message);
    }
};