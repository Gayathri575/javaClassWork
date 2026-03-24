package com.example.JavaNotes.service;

import com.example.JavaNotes.model.Notes;

import java.util.List;


    public interface NotesService {

        Notes createNote(Notes note);

        Notes updateNote(Long id, Notes note);

        void deleteNote(Long id);

        Notes getNoteById(Long id);

        List<Notes> getAllNotes();

        List<Notes> searchNotesByTitle(String keyword);

        List<Notes> getNotesByCategory(String category);
    }

