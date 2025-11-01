const fs = require("fs");
const path = require("path");
const swaggerJsDoc = require("swagger-jsdoc");

// Read the auto-generated swagger
let autogenSwagger = {};
if (fs.existsSync("./swagger-autogen-output.json")) {
  autogenSwagger = JSON.parse(
    fs.readFileSync("./swagger-autogen-output.json", "utf8")
  );
  console.log("✓ Loaded swagger-autogen-output.json");
} else {
  console.log(
    "⚠ swagger-autogen-output.json not found. Run npm run swagger first."
  );
}

// Read existing swagger files from router directories
const swaggerFilesDir = path.join(__dirname, "app", "router");

function findSwaggerFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findSwaggerFiles(filePath, fileList);
    } else if (file.endsWith(".swagger.js")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

const swaggerFiles = findSwaggerFiles(swaggerFilesDir);

// Generate swagger from existing files (with schemas/components)
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Parsa Store",
    version: "1.0.0",
    description: "A nodejs online store",
    contact: {
      name: "Parsa",
      email: "parsamokhtarpour98@gmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ BearerAuth: [] }],
};

const swaggerSpec = swaggerJsDoc({
  swaggerDefinition,
  apis: swaggerFiles,
});

// Merge: Keep existing paths from swaggerSpec, add missing paths from autogenSwagger
const mergedSwagger = {
  ...swaggerSpec,
  paths: {
    ...(autogenSwagger.paths || {}),
    ...(swaggerSpec.paths || {}),
  },
  components: {
    ...swaggerSpec.components,
    ...(autogenSwagger.components || {}),
  },
};

// Write the merged output
fs.writeFileSync(
  "./swagger-merged.json",
  JSON.stringify(mergedSwagger, null, 2)
);

console.log("✓ Generated swagger-merged.json");
console.log(
  `  - Auto-generated paths: ${Object.keys(autogenSwagger.paths || {}).length}`
);
console.log(
  `  - Existing schemas/components: ${
    Object.keys(swaggerSpec.components?.schemas || {}).length
  }`
);
console.log(
  `  - Total merged paths: ${Object.keys(mergedSwagger.paths).length}`
);

module.exports = { swaggerSpec: mergedSwagger };
