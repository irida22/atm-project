const canvas = document.getElementById('particles-bg');
const ctx = canvas.getContext('2d');
const particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = Math.random() - 0.5;
        this.vy = Math.random() - 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 100, 0, 0.5)';
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(0, 100, 0, ${(1 - distance/150) * 0.3})`;
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animate);
}

// Initialize
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
for (let i = 0; i < 100; i++) particles.push(new Particle());

// Handle resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Form handling
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username');
    const pin = document.getElementById('pin');
    const error = document.getElementById('error');
    const button = e.target.querySelector('button');
    const loading = document.querySelector('.loading');
    
    error.style.display = 'none';
    
    try {
        button.disabled = true;
        loading.classList.remove('d-none');
        
        const response = await fetch('http://localhost:5172/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username.value,
                password: pin.value
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Login successful! User ID: ' + data.userId);
        } else {
            error.style.display = 'block';
        }
    } catch (error) {
        error.style.display = 'block';
    } finally {
        button.disabled = false;
        loading.classList.add('d-none');
    }
});

animate(); 