const express = require('express');
const router = express.Router();


// To overwrite the default layout from home to admin
router.all('/*', (req, res, next)=>{  // /* Means everything after admin

    req.app.locals.layout = 'admin';
    next();


});

router.get('/', (req, res)=>{

    res.render('admin/index');

});

router.get('/dash', (req, res)=>{

    res.render('admin/dash');

});

module.exports = router;