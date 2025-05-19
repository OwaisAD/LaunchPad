import fs from "fs-extra";
// import path from "path";

export async function createNginxConfig(slug: string) {
  const config = `
server {
    listen 80;
    server_name ${slug}.launchpad.sportia.dk;

    location /api/ {
        proxy_pass http://${slug}-server:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://${slug}-client:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`;

  const nginxPath = `/etc/nginx/sites-available/${slug}.conf`;
  await fs.writeFile(nginxPath, config);

  const symlinkPath = `/etc/nginx/sites-enabled/${slug}.conf`;
  await fs.ensureSymlink(nginxPath, symlinkPath);
}
