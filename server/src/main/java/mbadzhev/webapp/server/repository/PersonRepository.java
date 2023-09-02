package mbadzhev.webapp.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mbadzhev.webapp.server.model.Person;

public interface PersonRepository extends JpaRepository<Person, Long> {
    List<Person> findByFullNameIgnoreCase(String fullName);
}
