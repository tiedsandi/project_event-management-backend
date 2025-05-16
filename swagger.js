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
        url: "https://projectevent-management-backend-production.up.railway.app/",
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
            created_by: {
              type: "string",
              description: "User ID who created the event",
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            register_count: {
              type: "integer",
              description: "Total number of registrations for this event",
            },
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
        RegistrationPopulated: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { $ref: "#/components/schemas/User" },
            event: { type: "string" },
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
