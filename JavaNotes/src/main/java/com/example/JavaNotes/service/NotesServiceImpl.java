package com.example.JavaNotes.service;

import com.example.JavaNotes.model.Notes;
import com.example.JavaNotes.repository.NotesRepository;
import org.springframework.stereotype.Service;

import java.util.List;


    @Service
    public class NotesServiceImpl implements NotesService {

        private final NotesRepository notesRepository;

        public NotesServiceImpl(NotesRepository notesRepository) {
            this.notesRepository = notesRepository;
        }

        @Override
        public Notes createNote(Notes note) {
            return notesRepository.save(note);
        }

        @Override
        public Notes updateNote(Long id, Notes note) {
            Notes existingNote = notesRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));

            existingNote.setTitle(note.getTitle());
            existingNote.setContent(note.getContent());
            existingNote.setCategory(note.getCategory());

            return notesRepository.save(existingNote);
        }

        @Override
        public void deleteNote(Long id) {
            notesRepository.deleteById(id);
        }

        @Override
        public Notes getNoteById(Long id) {
            return notesRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Note not found with id: " + id));
        }

        @Override
        public List<Notes> getAllNotes() {
            return notesRepository.findAll();
        }

        @Override
        public List<Notes> searchNotesByTitle(String keyword) {
            return notesRepository.findByTitleContainingIgnoreCase(keyword);
        }

        @Override
        public List<Notes> getNotesByCategory(String category) {
            return notesRepository.findByCategoryIgnoreCase(category);
        }
    }

