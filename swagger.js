const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Management API",
      version: "1.0.0",
      description: "Backend API for Event Management",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
      {
        url: "https://yourapp-production.railway.app",
        description: "Production server",
      },
    ],
    tags: [
      { name: "Users", description: "User management" },
      { name: "Events", description: "Event management" },
      { name: "Registrations", description: "Event registration management" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["admin", "user"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Event: {
          type: "object",
          properties: {
            _id: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            date: { type: "string", format: "date" },
            maximum: { type: "string" },
            location: { type: "string" },
            imageUrl: { type: "string" },
            is_active: { type: "integer", enum: [0, 1] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Registration: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string", description: "User ID" },
            event: { type: "string", description: "Event ID" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
