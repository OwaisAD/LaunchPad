export const techOptions = [
  {
    key: "frontend",
    label: "Select Frontend/Client Framework",
    multi: false,
    isOptional: false,
    options: [
      {
        name: "ReactJS",
        note: "Using Vite",
        documentation: "https://vite.dev/guide/",
      },
      {
        name: "Vue",
        note: "Using Vite",
        documentation: "https://vite.dev/guide/",
      },
      {
        name: "Angular",
        documentation: "https://v17.angular.io/docs",
      },
      {
        name: "ASP.NET",
        documentation: "https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-7.0",
      },
    ],
  },
  {
    key: "backend",
    label: "Select Backend/Server Framework",
    multi: false,
    isOptional: false,
    options: [
      {
        name: "ExpressJS",
        note: "Runs on Node.js 22.4.0 LTS",
        documentation: "https://expressjs.com/",
      },
      { name: "NestJS", note: "Runs on Node.js 22.4.0 LTS", documentation: "https://docs.nestjs.com/" },
    ],
  },
  {
    key: "databases",
    label: "Select one or more Databases",
    multi: true,
    isOptional: false,
    options: [
      {
        name: "PostgreSQL",
        note: "Relational",
        documentation: "https://www.postgresql.org/docs/",
      },
      { name: "Redis", note: "In-memory data store", documentation: "https://redis.io/docs/" },
      { name: "MongoDB", note: "NoSQL", documentation: "https://www.mongodb.com/docs/" },
      { name: "Neo4j", note: "Graph DB", documentation: "https://neo4j.com/docs/" },
    ],
  },
  // {
  //   key: "deployment",
  //   label: "Select Deployment Platform",
  //   multi: false,
  //   isOptional: false,
  //   options: [{ name: "DigitalOcean" }, { name: "AWS" }, { name: "Azure" }],
  // },
  {
    key: "repo",
    label: "Select a place to store your code",
    multi: false,
    isOptional: false,
    options: [{ name: "GitHub" }, { name: "GitLab" }, { name: "Azure" }],
  },
  {
    key: "dbConnector",
    label: "Select Database Connector(s)",
    multi: true,
    isOptional: false,
    options: [
      {
        name: "Kysely",
        documentation: "https://kysely.dev/",
      },
      {
        name: "Prisma ORM",
        documentation: "https://www.prisma.io/docs/",
      },
      {
        name: "PG",
      },
      {
        name: "TypeORM",
      },
      { name: "Sequelize" },
      { name: "Mongoose" },
      { name: "neo4j-driver" },
      { name: "Redis Client" },
    ],
  },
  {
    key: "logging",
    label: "Select Logging Tool(s)",
    multi: true,
    isOptional: true,
    options: [{ name: "Winston" }, { name: "Pino" }, { name: "Morgan" }],
  },
  {
    key: "monitoring",
    label: "Select Monitoring Tool(s)",
    multi: true,
    isOptional: true,
    options: [{ name: "Prometheus" }, { name: "Grafana" }, { name: "Sentry" }],
  },
  {
    key: "testing",
    label: "Select Testing Framework(s)",
    multi: true,
    isOptional: true,
    options: [
      { name: "Vitest", note: "Default testing library" },
      { name: "Jest" },
      { name: "Mocha" },
      { name: "Chai" },
    ],
  },
  {
    key: "auth",
    label: "Select Authentication Libraries",
    multi: false,
    isOptional: true,
    options: [
      { name: "Auth0", documentation: "https://auth0.com/docs" },
      { name: "Firebase Auth", documentation: "https://firebase.google.com/docs/auth" },
      { name: "Clerk", documentation: "https://clerk.dev/docs" },
    ],
  },
];
