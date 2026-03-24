package com.example.JavaNotes.repository;

import com.example.JavaNotes.model.Notes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotesRepository extends JpaRepository<Notes, Long> {

    List<Notes> findByCategoryIgnoreCase(String category);

    List<Notes> findByTitleContainingIgnoreCase(String keyword);
}