package com.example.JavaNotes.controller;

import com.example.JavaNotes.model.Notes;
import com.example.JavaNotes.service.NotesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
    @RestController
    @RequestMapping("/api/notes")
    public class NotesController {

        private final NotesService notesService;

        public NotesController(NotesService notesService) {
            this.notesService = notesService;
        }

        // Create new note
        @PostMapping
        public ResponseEntity<Notes> createNote(@RequestBody Notes note) {
            Notes createdNote = notesService.createNote(note);
            return ResponseEntity.ok(createdNote);
        }

        // Update note
        @PutMapping("/{id}")
        public ResponseEntity<Notes> updateNote(@PathVariable Long id, @RequestBody Notes note) {
            Notes updatedNote = notesService.updateNote(id, note);
            return ResponseEntity.ok(updatedNote);
        }

        // Delete note
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
            notesService.deleteNote(id);
            return ResponseEntity.noContent().build();
        }

        // Get note by ID
        @GetMapping("/{id}")
        public ResponseEntity<Notes> getNoteById(@PathVariable Long id) {
            Notes note = notesService.getNoteById(id);
            return ResponseEntity.ok(note);
        }

        // Get all notes
        @GetMapping
        public ResponseEntity<List<Notes>> getAllNotes() {
            List<Notes> notes = notesService.getAllNotes();
            return ResponseEntity.ok(notes);
        }

        // Search notes by title
        @GetMapping("/search")
        public ResponseEntity<List<Notes>> searchNotes(@RequestParam String keyword) {
            List<Notes> notes = notesService.searchNotesByTitle(keyword);
            return ResponseEntity.ok(notes);
        }


        // Get notes by category
        @GetMapping("/category")
        public ResponseEntity<List<Notes>> getNotesByCategory(@RequestParam String category) {
            List<Notes> notes = notesService.getNotesByCategory(category);
            return ResponseEntity.ok(notes);
        }

    }

