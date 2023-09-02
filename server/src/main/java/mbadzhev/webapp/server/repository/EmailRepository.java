package mbadzhev.webapp.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mbadzhev.webapp.server.model.Email;
import mbadzhev.webapp.server.model.Person;

public interface EmailRepository extends JpaRepository<Email, Long> {
    List<Email> findByPerson(Person person);
}
