import express from "express";
import { generateSitemap } from "../controllers/PostController";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
    try {
        const sitemap = await generateSitemap();
        res.header("Content-Type", "application/xml");
        res.send(sitemap);
    } catch (error) {
        res.status(500).send("Error generating sitemap");
    }
});

export default router;