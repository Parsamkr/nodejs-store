const {
  NamespaceController,
} = require("../../http/controllers/suppport/namespace.controller");

const router = require("express").Router();

router.post("/", NamespaceController.addNamespace);
router.get("/", NamespaceController.getAllNamespaces);

module.exports = { namespaceRoutes: router };
