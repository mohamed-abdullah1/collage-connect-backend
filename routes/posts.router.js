const router = require("express").Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  reactPost,
  makeComment,
  deleteComment,
} = require("../controllers/posts.controller");
const multer = require("multer");
const {
  verifyDoctor,
  verifyToken,
  checkStuffOrDoctor,
} = require("../middleware/auth.middleware");
const upload = multer({ storage: multer.memoryStorage() });

router.route("/create").post(
  verifyToken,
  checkStuffOrDoctor,
  upload.fields([
    { name: "posts_files", maxCount: 5 },
    { name: "post_image", maxCount: 1 },
  ]),
  // upload.array("posts_images", 5),
  createPost
);
router.route("/all").get(verifyToken, getAllPosts);
router
  .route("/:id")
  .get(verifyToken, getPostById)
  .put(
    verifyToken,
    checkStuffOrDoctor,
    upload.fields([
      { name: "posts_files", maxCount: 5 },
      { name: "post_image", maxCount: 1 },
    ]),
    updatePost
  )
  .delete(verifyToken, checkStuffOrDoctor, deletePost);
router.put("/add-comment/:postId", verifyToken, makeComment);
router.put("/delete-comment/:postId/:commentId", verifyToken, deleteComment);
router.route("/react/:id").put(verifyToken, reactPost);
module.exports = router;
