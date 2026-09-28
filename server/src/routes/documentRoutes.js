const express = require('express');
const multer = require('multer');
const router = express.Router();
const documentController = require('../controllers/documentController');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max size
});

router.get('/documents', documentController.getDocuments);
router.post('/documents/upload', upload.single('file'), documentController.uploadDocument);
router.delete('/documents/:id', documentController.deleteDocument);

module.exports = router;
