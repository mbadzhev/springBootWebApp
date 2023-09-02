package mbadzhev.webapp.server.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mbadzhev.webapp.server.model.Address;
import mbadzhev.webapp.server.model.Person;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByPerson(Person person);
}
