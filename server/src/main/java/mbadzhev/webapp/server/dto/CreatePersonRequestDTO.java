package mbadzhev.webapp.server.dto;

import java.util.List;

import mbadzhev.webapp.server.model.Address;
import mbadzhev.webapp.server.model.Email;
import mbadzhev.webapp.server.model.Person;

public class CreatePersonRequestDTO {
    private Person person;
    private List<Email> emails;
    private List<Address> addresses;

    CreatePersonRequestDTO() {
    };

    CreatePersonRequestDTO(Person person, List<Email> emails, List<Address> addresses) {
        this.person = person;
        this.emails = emails;
        this.addresses = addresses;
    };

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public List<Email> getEmails() {
        return emails;
    }

    public void setEmails(List<Email> emails) {
        this.emails = emails;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<Address> addresses) {
        this.addresses = addresses;
    }

}
