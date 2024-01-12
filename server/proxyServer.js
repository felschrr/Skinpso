const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const app = express();
app.use(cors());

// Configurer le proxy pour rediriger les requêtes vers le serveur Buff
const buffProxy = createProxyMiddleware({
  target: "https://buff.163.com",
  changeOrigin: true,
  pathRewrite: {
    "^/buff-proxy": "", // Supprimer le préfixe "/buff-proxy" lors de la redirection
  },
});

// Utiliser le proxy pour toutes les requêtes vers le serveur Buff
app.use("/buff-proxy", buffProxy);

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
