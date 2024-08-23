const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    color: 'blue',
    shade: 'darkblue',
    exploded: false,
};

let particles = [];

function drawBall() {
    const gradient = context.createRadialGradient(ball.x, ball.y, ball.radius / 4, ball.x, ball.y, ball.radius);
    gradient.addColorStop(0, ball.color);
    gradient.addColorStop(1, ball.shade);

    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    context.fillStyle = gradient;
    context.fill();
    context.closePath();
}

function clearCanvas(){
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawParticles() {
    particles.forEach((particle, index) => {
        particle.x += particle.velocityX,
        particle.y += particle.velocityY,
        particle.radius *=(1 - particle.decay);
        particle.life--;

        if (particle.life <= 0) {
            particles.splice(index, 1);
        } else {
            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false);
            context.fillStyle = particle.color;
            context.fill();
            context.closePath();
        }
    });

    if (particles.length === 0  && ball.exploded) {
        resetBall();
    } 
}

function resetBall() {
    ball.exploded = false;
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    particles = [];
}

canvas.addEventListener('click', (e) => {
    const dist = Math.hypot(e.clientX - ball.x, e.clientY - ball.y);

    if (dist < ball.radius && !ball.exploded) {
        ball.exploded = true;
        for(let i = 0; i < 50; i++){
            particles.push({
                x: ball.x,
                y: ball.y,
                radius: Math.random() * 5 + 2,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                velocityX: (Math.random() - 0.5) * 5,
                velocityY: (Math.random() - 0.5) * 5,
                life: 100,
                decay: Math.random() * 0.01 + 0.02,
            });
        } 
    }
});

function animate() {
    clearCanvas();
    if (!ball.exploded) {
        drawBall();
    } else {
        drawParticles();
    }
    requestAnimationFrame(animate);
}

animate();