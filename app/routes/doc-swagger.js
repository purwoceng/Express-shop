const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Employee API",
      description: "Employee API Information",
      contact: {
        name: "Sagi Weizmann",
      },
    },
    servers: [
      {
        url: "http://localhost:4200",
      },
    ],
  },
  apis: ["./app/routes/*.js"],
};

export default swaggerOptions;
