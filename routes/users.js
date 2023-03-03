var express = require('express')
var app = express()
var ObjectId = require('mongodb').ObjectId

// SHOW LIST OF USERS
app.get('/', function(req, res, next) {	
	req.db.collection('users').find().sort({"_id": -1}).toArray(function(err, result) {
		if (err) {
			req.flash('error', err)
			res.render('user/list', {
				title: 'User List', 
				data: ''
			})
		} else {
			res.render('user/list', {
				title: 'User List', 
				data: result
			})
		}
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	res.render('user/add', {
		title: 'Add New User',
		name: '',
		description: '',
		Markdown: ''		
	})
})

// add
app.post('/add', function(req, res, next){	
	req.assert('name', 'Name is required').notEmpty()           
	req.assert('description', 'description is required').notEmpty()             
    req.assert('Markdown', 'A valid Markdown is required').isMarkdown()  

    var errors = req.validationErrors()
    
    if( !errors ) {
		var user = {
			name: req.sanitize('name').escape().trim(),
			description: req.sanitize('description').escape().trim(),
			Markdown: req.sanitize('Markdown').escape().trim()
		}
				 
		req.db.collection('users').insert(user, function(err, result) {
			if (err) {
				req.flash('error', err)
				
				res.render('user/add', {
					title: 'Add New User',
					name: user.name,
					description: user.description,
					Markdown: user.Markdown					
				})
			} else {				
				req.flash('success', 'Data added successfully!')				
				res.redirect('/users')
			}
		})		
	}
	else { 
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
        res.render('user/add', { 
            title: 'Add New User',
            name: req.body.name,
            description: req.body.description,
            Markdown: req.body.Markdown
        })
    }
})

// edit
app.get('/edit/(:id)', function(req, res, next){
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').find({"_id": o_id}).toArray(function(err, result) {
		if(err) return console.log(err)
		
		if (!result) {
			req.flash('error', 'User not found with id = ' + req.params.id)
			res.redirect('/users')
		}
		else {
			res.render('user/edit', {
				title: 'Edit User', 
				id: result[0]._id,
				name: result[0].name,
				description: result[0].description,
				Markdown: result[0].Markdown					
			})
		}
	})	
})

// post
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('name', 'Name is required').notEmpty()          
	req.assert('description', 'description is required').notEmpty()             
    req.assert('Markdown', 'A valid Markdown is required').isMarkdown()  

    var errors = req.validationErrors()
    
    if( !errors ) {
		var user = {
			name: req.sanitize('name').escape().trim(),
			description: req.sanitize('description').escape().trim(),
			Markdown: req.sanitize('Markdown').escape().trim()
		}
		
		var o_id = new ObjectId(req.params.id)
		req.db.collection('users').update({"_id": o_id}, user, function(err, result) {
			if (err) {
				req.flash('error', err)
				res.render('user/edit', {
					title: 'Edit User',
					id: req.params.id,
					name: req.body.name,
					description: req.body.description,
					Markdown: req.body.Markdown
				})
			} else {
				req.flash('success', 'Data updated successfully!')
				
				res.redirect('/users')
			}
		})		
	}
	else {
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
        res.render('user/edit', { 
            title: 'Edit User',            
			id: req.params.id, 
			name: req.body.name,
			description: req.body.description,
			Markdown: req.body.Markdown
        })
    }
})

// delete
app.delete('/delete/(:id)', function(req, res, next) {	
	var o_id = new ObjectId(req.params.id)
	req.db.collection('users').remove({"_id": o_id}, function(err, result) {
		if (err) {
			req.flash('error', err)
			// redirect to users list pdescription
			res.redirect('/users')
		} else {
			req.flash('success', 'User deleted successfully! id = ' + req.params.id)
			
			res.redirect('/users')
		}
	})	
})

module.exports = app
