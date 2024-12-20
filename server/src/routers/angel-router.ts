import express from "express";
import angelService, { Angel } from "../services/angel-service";
import angelCommentService from "../services/angelcomment-service";

const angelrouter = express.Router();

// **Fetch All Angels**
angelrouter.get("/angels", (_req, res) => {
  angelService
    .getAll()
    .then((angels) => res.status(200).json(angels))
    .catch((err) => {
      console.error("Error fetching angels:", err);
      res.status(500).send("Failed to fetch angels");
    });
});

// **Fetch Specific Angel by ID**
angelrouter.get("/angels/:angel_id", (req, res) => {
  const angel_id = Number(req.params.angel_id);
  if (isNaN(angel_id)) {
    return res.status(400).send("Invalid angel ID");
  }

  angelService
    .get(angel_id)
    .then((angel) => res.status(200).json(angel))
    .catch((err) => {
      console.error(`Error fetching angel with ID ${angel_id}:`, err);
      res.status(500).send("Failed to fetch angel");
    });
});

// **Create New Angel**
angelrouter.post("/angels", (req, res) => {
  const { name, description, image, release_year, views, user_id, series_id } = req.body;

  if (!name || !description || !user_id || !series_id) {
    return res.status(400).send("Missing required fields: name, description, user_id, series_id");
  }

  if (isNaN(Number(release_year))) {
    return res.status(400).send("Invalid release year");
  }

  angelService
    .createAngel({ name, description, image, release_year, views: 0, user_id, series_id})
    .then((newAngel) => res.status(201).json(newAngel))
    .catch((err) => {
      console.error("Error creating angel:", err);
      res.status(500).send("Failed to create angel");
    });
});

// **Update Existing Angel**
angelrouter.put("/angels/:angel_id", (req, res) => {
  const angel_id = Number(req.params.angel_id);
  const angel: Angel = req.body;

  if (isNaN(angel_id) || !angel) {
    return res.status(400).send("Invalid angel ID or missing angel data");
  }

  angelService
    .updateAngel({ ...angel, angel_id })
    .then(() => res.status(200).send("Angel updated successfully"))
    .catch((err) => {
      console.error(`Error updating angel with ID ${angel_id}:`, err);
      res.status(500).send("Failed to update angel");
    });
});

//Hent Angel History
angelrouter.get("/angels/:angel_id/history", (req, res) => {
  const angel_id = Number(req.params.angel_id);

  if(isNaN(angel_id)){
    return res.status(400).send("Invalid angel ID");
  }

  angelService
    .getAngelHistory(angel_id)
    .then((history) => {
      res.status(200).json(history);
    })
    .catch((err) => {
      console.error('Error fetching history from angel ID ${angel_id}:', err);
      res.status(500).send("Failed to fetch angel history");
    });
});

// **Delete Angel**
angelrouter.delete("/angels/:angel_id", async (req, res) => {
  const angel_id = Number(req.params.angel_id);

  if (isNaN(angel_id)) {
    console.warn("Invalid angel ID received:", req.params.angel_id);
    return res.status(400).json({ error: "Invalid angel ID" });
  }

  try {
    const angelExists = await angelService.get(angel_id); // Sjekk om ID-en finnes
    if (!angelExists) {
      return res.status(404).json({ error: "Angel not found" });
    }

    await angelService.deleteAngel(angel_id);
    res.status(200).json({ message: "Angel deleted successfully" });
  } catch (err) {
    console.error(`Error deleting angel with ID ${angel_id}:`, err);
    res.status(500).json({ error: "Failed to delete angel" });
  }
});

/*angelrouter.delete("/angels/:angel_id", (req, res) => {
  const angel_id = Number(req.params.angel_id);

  if (isNaN(angel_id)) {
      console.warn("Invalid angel ID received:", req.params.angel_id);
      return res.status(400).json({ error: "Invalid angel ID" });
  }

  angelService.deleteAngel(angel_id)
      .then(() => res.status(200).json({ message: "Angel deleted successfully" }))
      .catch((err) => {
          console.error(`Error deleting angel with ID ${angel_id}:`, {
              message: err.message,
              stack: err.stack,
              sqlError: err.sqlMessage || "No SQL error available",
          });
          res.status(500).json({
              error: "Failed to delete angel",
              details: err.message,
          });
      });
});*/


// **Increment Views**
angelrouter.put("/angels/:angel_id/increment-views", (req, res) => {
  const angel_id = Number(req.params.angel_id);

  if (isNaN(angel_id)) {
    return res.status(400).send("Invalid angel ID");
  }

  angelService
    .incrementViews(angel_id)
    .then((updatedAngel) => res.status(200).json(updatedAngel))
    .catch((err) => {
      console.error(`Error incrementing views for angel with ID ${angel_id}:`, err);
      res.status(500).send("Failed to increment views");
    });
});

// **Fetch Angels by Series**
angelrouter.get("/series/:series_id", (req, res) => {
  const series_id = Number(req.params.series_id);

  if (isNaN(series_id)) {
    return res.status(400).send("Invalid series ID");
  }

  angelService
    .getBySeries(series_id)
    .then((angels) => res.status(200).json(angels))
    .catch((err) => {
      console.error(`Error fetching angels for series ID ${series_id}:`, err);
      res.status(500).send("Failed to fetch angels by series");
    });
});

// **Fetch Angel Count by Series**
angelrouter.get("/series/:series_id/count", (req, res) => {
  const series_id = Number(req.params.series_id);
  if (isNaN(series_id)) {
    return res.status(400).send("Invalid series ID");
  }
  angelService
    .getAngelCount(series_id)
    .then((count) => res.status(200).json({ count }))
    .catch((err) => {
      console.error(`Error fetching angel count for series ID ${series_id}:`, err);
      res.status(500).send("Failed to fetch angel count by series");
    })
})

// **Search Angels**
angelrouter.get("/angels/search/:query", (req, res) => {
  const query = req.params.query;

  angelService
    .search(query)
    .then((results) => {
      res.status(200).json(results)
    })
    .catch((err) => {
      console.error(`Error searching for angels with query "${query}":`, err);
      res.status(500).send("Failed to search angels");
    });
});

// **Fetch Comments for an Angel**
angelrouter.get("/angels/:angel_id/comments", (req, res) => {
  const angel_id = Number(req.params.angel_id);

  if (isNaN(angel_id)) {
    return res.status(400).send("Invalid angel ID");
  }

  angelCommentService
    .getAngelComments(angel_id)
    .then((comments) => res.status(200).json(comments))
    .catch((err) => {
      console.error(`Error fetching comments for angel ID ${angel_id}:`, err);
      res.status(500).send("Failed to fetch comments");
    });
});

// **Add Comment to an Angel**
angelrouter.post("/angels/:angel_id/comments", (req, res) => {
  const angel_id = Number(req.params.angel_id);
  const { user_id, content } = req.body;

  if (!user_id || !content) {
    return res.status(400).send("Missing user ID or comment content");
  }

  angelCommentService
    .addAngelComment(angel_id, user_id, content)
    .then((commentId) => res.status(201).json({ angelcomment_id: commentId }))
    .catch((err) => {
      console.error(`Error adding comment for angel ID ${angel_id}:`, err);
      res.status(500).send("Failed to add comment");
    });
});

// **Edit Comment**
angelrouter.put("/angels/comments/:angelcomment_id", (req, res) => {
  const angelcomment_id = Number(req.params.angelcomment_id);
  const { user_id, role, content } = req.body;

  if (!content || isNaN(user_id) || !role) {
    return res.status(400).send("Invalid input data");
  }

  angelCommentService
    .updateAngelComment(angelcomment_id, user_id, role, content)
    .then(() => res.status(200).send("Comment updated successfully"))
    .catch((err) => {
      console.error(`Error updating comment ID ${angelcomment_id}:`, err);
      res.status(500).send("Failed to update comment");
    });
});


// **Delete Comment**
angelrouter.delete("/angels/comments/:angelcomment_id", (req, res) => {
  const angelcomment_id = Number(req.params.angelcomment_id);
  const user_id = Number(req.body.user_id);
  const role = req.body.role;

  if (isNaN(angelcomment_id) || isNaN(user_id) || !role) {
    return res.status(400).send("Invalid comment ID, user ID, or role");
  }

  angelCommentService
    .deleteAngelComment(angelcomment_id, user_id, role)
    .then(() => res.status(200).send("Comment deleted successfully"))
    .catch((err) => {
      console.error(`Error deleting comment ID ${angelcomment_id}:`, err);
      res.status(500).send("Failed to delete comment");
    });
});


// Get the 10 most viewed angels (Popular Angels)
angelrouter.get("/popular", async (req, res) => {
  try {
    const popularAngels = await angelService.getPopular();
    res.status(200).json(popularAngels);
  } catch (error) {
    console.error("Error fetching popular angels:", error);
    res.status(500).send("Failed to fetch popular angels.");
  }
});


export default angelrouter;
