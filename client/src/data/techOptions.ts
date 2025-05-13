export const techOptions = {
  frontend: [{ name: "ReactJS" }, { name: "Vue" }, { name: "Angular" }],
  backend: [
    { name: "ExpressJS", note: "Runs on Node.js 22.4.0 LTS" },
    { name: "NestJS", note: "Runs on Node.js 22.4.0 LTS" },
  ],
  databases: [{ name: "PostgreSQL" }, { name: "Redis" }, { name: "MongoDB" }, { name: "Neo4j" }],
  deployment: [{ name: "DigitalOcean" }, { name: "AWS" }, { name: "Azure" }],
  repo: [{ name: "GitHub" }, { name: "GitLab" }, { name: "ADO" }],
  dbConnector: [
    { name: "Kysely" },
    { name: "Prisma ORM" },
    { name: "PG" },
    { name: "TypeORM" },
    { name: "Sequelize" },
    { name: "Mongoose" },
    { name: "neo4j-driver" },
    { name: "Redis Client" },
  ],
  logging: [{ name: "Winston" }, { name: "Pino" }, { name: "Morgan" }],
  monitoring: [{ name: "Prometheus" }, { name: "Grafana" }, { name: "Sentry" }],
  testing: [{ name: "Jest" }, { name: "Mocha" }, { name: "Chai" }],
  auth: [{ name: "Auth0" }, { name: "Firebase Auth" }, { name: "Clerk" }],
};
