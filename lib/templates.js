export const TEMPLATES = [
    {
        id: "modern-portfolio",
        name: "Modern Portfolio",
        description: "A clean, responsive portfolio with a hero section, skills, and projects.",
        thumbnail: "/templates/modern-portfolio.png",
        fields: [
            { name: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
            { name: "role", label: "Job Title", type: "text", placeholder: "Full Stack Developer" },
            { name: "about", label: "About Me", type: "textarea", placeholder: "I build accessible apps..." },
            { name: "email", label: "Contact Email", type: "email", placeholder: "jane@example.com" },
            { name: "github", label: "GitHub URL", type: "url", placeholder: "https://github.com/jane" },
            { name: "linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/in/jane" },
        ],
        generate: (data) => `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.name} - Portfolio</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 text-gray-900 font-sans">
        <header class="bg-white shadow-sm sticky top-0 z-50">
          <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold text-indigo-600">${data.name}</h1>
            <nav class="space-x-4">
              <a href="#about" class="hover:text-indigo-600">About</a>
              <a href="#contact" class="hover:text-indigo-600">Contact</a>
            </nav>
          </div>
        </header>

        <section id="hero" class="py-20 bg-indigo-600 text-white text-center">
          <div class="container mx-auto px-4">
            <h2 class="text-4xl md:text-6xl font-bold mb-6">Hi, I'm ${data.name}</h2>
            <p class="text-xl md:text-2xl opacity-90 mb-8">${data.role}</p>
            <a href="#contact" class="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition">Get in Touch</a>
          </div>
        </section>

        <section id="about" class="py-16 container mx-auto px-4 text-center">
          <h3 class="text-3xl font-bold mb-8">About Me</h3>
          <p class="max-w-2xl mx-auto text-lg text-gray-700 leading-relaxed">
            ${data.about}
          </p>
        </section>

        <section id="contact" class="py-16 bg-gray-100 text-center">
          <div class="container mx-auto px-4">
            <h3 class="text-3xl font-bold mb-8">Let's Connect</h3>
            <div class="flex justify-center gap-6">
              ${data.email ? `<a href="mailto:${data.email}" class="text-indigo-600 hover:underline">Email</a>` : ''}
              ${data.github ? `<a href="${data.github}" target="_blank" class="text-indigo-600 hover:underline">GitHub</a>` : ''}
              ${data.linkedin ? `<a href="${data.linkedin}" target="_blank" class="text-indigo-600 hover:underline">LinkedIn</a>` : ''}
            </div>
          </div>
        </section>

        <footer class="bg-gray-900 text-white py-8 text-center">
          <p>&copy; ${new Date().getFullYear()} ${data.name}. All rights reserved.</p>
        </footer>
      </body>
      </html>
    `
    }
];

export function getTemplate(id) {
    return TEMPLATES.find(t => t.id === id);
}
