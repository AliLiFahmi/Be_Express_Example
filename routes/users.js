const express = require("express");
const verifyToken = require("../middlewares/verify-token");
const router = express.Router();
const { 
  getAllData, 
  getDataById, 
  updateData, 
  deleteData,
  profile
} = require('../controllers/userController')

router.get('/', verifyToken, getAllData); // semua data user
router.get('/:id', verifyToken, getDataById); // data user sesuai dengan id
router.put('/:id', verifyToken, updateData);  // update user sesuai dengan id
router.delete('/:id', verifyToken, deleteData); // hapus user sesuai dengan id
router.get('/profile', verifyToken, profile); // data user sesuai dengan user yang login

module.exports = router;
