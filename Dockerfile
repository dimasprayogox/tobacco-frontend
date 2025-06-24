# Gunakan image Node.js resmi
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Salin file package.json dan bun.lock (jika pakai bun)
COPY package.json ./
COPY bun.lock ./

# Install Bun (jika ingin pakai bun)
RUN npm install -g bun

# Install dependencies
RUN bun install

# Salin semua source code
COPY . .

# Build aplikasi Nuxt
RUN bun run build

# Expose port yang digunakan oleh Nuxt (default 3000)
EXPOSE 3000

# Jalankan aplikasi di mode production secara langsung
CMD ["node", ".output/server/index.mjs"]
