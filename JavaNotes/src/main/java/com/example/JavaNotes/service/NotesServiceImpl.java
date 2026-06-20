package com.example.JavaNotes.service;

import com.example.JavaNotes.model.Notes;
import com.example.JavaNotes.repository.NotesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
@Service
public class NotesServiceImpl implements NotesService {

    @Autowired
    private NotesRepository notesRepository;

    @Override
    public Notes createNote(Notes note) {
        return notesRepository.save(note);
    }

    @Override
    public Notes updateNote(Long id, Notes note) {

        Notes existingNotes = notesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notes Not Found"));

        existingNotes.setTitle(note.getTitle());
        existingNotes.setContent(note.getContent());
        existingNotes.setCategory(note.getCategory());

        return notesRepository.save(existingNotes);
    }

    @Override
    public void deleteNote(Long id) {
        notesRepository.deleteById(id);
    }

    @Override
    public Notes getNoteById(Long id) {
        return notesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notes Not Found"));
    }

    @Override
    public List<Notes> getAllNotes() {
        return notesRepository.findAll();
    }
    @Override
    public List<Notes> searchNotesByTitle(String keyword) {
        return notesRepository.findByTitleContaining(keyword);
    }

    @Override
    public List<Notes> getNotesByCategory(String category) {
        return notesRepository.findByCategory(category);
    }
}
