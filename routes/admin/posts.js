const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');



// To overwrite the default layout from home to admin
router.all('/*', (req, res, next)=>{  // /* Means everything after admin

    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res)=>{

    Post.find({}).then(posts=>{

        res.render('admin/posts', {posts: posts});
    });

});

router.get('/', (req, res)=>{

    res.render('admin/posts');

});

router.get('/create', (req, res)=>{

    res.render('admin/posts/create');

});

router.post('/create', (req, res)=>{

    let errors=[];

    if(!req.body.title){

        errors.push({message: 'Please Add a Title'});
    }
    
    if(!req.body.status){

        errors.push({message: 'Please Select a Status'});
    }

    if(!req.body.body){

        errors.push({message: 'Please Add Description'});
    }


    if(errors.length>0){
            res.render('admin/posts/create',{
                errors:errors
            })

    }   else{
    
    let filename = 'funny-photo-wallpaper.jpg';
    if(!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now()+ '-' + file.name;

        file.mv('./public/uploads/' + filename, (err)=>{
        if(err) throw err;

    }); 
  }

    let allowComments = true;

    if(req.body.allowComments)
    {
        allowComments = true;
    }
    else
    {
        allowComments = false;
    }

    const newPost = new Post({
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename

    });

    newPost.save().then(savedPost =>{
        res.redirect('/admin/posts');
    }).catch(error=>{
        console.log('Could not Save Post');
    });
    //console.log(req.body); 
  } 
});

router.get('/edit/:id', (req, res)=>{

    Post.findOne({_id: req.params.id}).then(post=>{

        res.render('admin/posts/edit', {post: post});
    });

});

router.put('/edit/:id', (req, res)=>{

    Post.findOne({_id: req.params.id})
    
    
    .then(post=>{

        if(req.body.allowComments)
        {
            allowComments = true;
        }
        else
        {
            allowComments = false;
        }

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        
        post.save().then(updatedPost=>{

            res.redirect('/admin/posts');
        });
    });
});

router.delete('/:id', (req, res)=>{

    Post.findOne({_id: req.params.id})
        .then(post=>{

            fs.unlink(uploadDir + post.file, (err)=>{
                post.remove();
                res.redirect('/admin/posts');
            });
        });
});


module.exports = router;