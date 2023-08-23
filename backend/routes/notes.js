const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Notes = require('../models/Notes');
const router = express.Router();
const { validationResult, body } = require('express-validator');


// get all the notes login required
router.get('/fetchallnotes', authMiddleware,
    async (req, res) => {
        try {
            const notes = await Notes.find({ user: req.user.id });
            res.send({
                message: 'notes ',
                success: true,
                notes
            })
        } catch (error) {
            console.log(error)
            return res.send({
                success: false,
                message: 'Error in fetch all notes !'
            })
        }
    })

// create notes
// create the notes login required 
router.post('/create-notes', authMiddleware,
    [
        body('title', 'Enter a Title').isLength({ min: 1 }),
        body('description', 'Enter a  description').isLength({ min: 5 }),
    ],
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;
            // if error in validation 
            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.send({ errors: result.array() });
            }

            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const saveNote = await note.save()

            return res.send({
                success: true,
                message: 'New Notes Created !',
                saveNote
            })

        } catch (error) {
            console.log(error)
            return res.send({
                success: false,
                message: 'Error in Create notes !'
            })
        }
    })

// update notes login required
router.put('/updatenote/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // create new notes
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // check wheather the notes is present or not 
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.send({
                success: false,
                message: 'Notes not found !'
            })
        }
        // check wheather the user id and note id is equal or not 
        if (note.user.toString() !== req.user.id) {
            return res.send({
                success: false,
                message: 'Not Allowed !'
            })
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        return res.send({
            success: true,
            message: 'Update Successfully !',
            note
        })
    } catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Error in Update notes !'
        })
    }
})

// delete the note login required
router.delete('/deletenote/:id', authMiddleware, async (req, res) => {
    try {
        // check wheather the notes is present or not 
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.send({
                success: false,
                message: 'Notes not found !'
            })
        }
        // check wheather the user id and note id is equal or not 
        if (note.user.toString() !== req.user.id) {
            return res.send({
                success: false,
                message: 'Not Allowed !'
            })
        }
        note = await Notes.findByIdAndDelete(req.params.id);

        return res.send({
            success: true,
            message: 'delete Successfully !',
            note
        })
    }
    catch (error) {
        console.log(error)
        return res.send({
            success: false,
            message: 'Error in Delete notes !'
        })
    }
})
module.exports = router