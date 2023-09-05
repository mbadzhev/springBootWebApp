package mbadzhev.webapp.server.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import mbadzhev.webapp.server.dto.PersonDTO;
import mbadzhev.webapp.server.model.Address;
import mbadzhev.webapp.server.model.Email;
import mbadzhev.webapp.server.model.Person;
import mbadzhev.webapp.server.repository.AddressRepository;
import mbadzhev.webapp.server.repository.EmailRepository;
import mbadzhev.webapp.server.repository.PersonRepository;

@RestController
@RequestMapping("/api/people")
// @CrossOrigin(origins = "http://127.0.0.1:5173/")
public class PeopleController {
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private EmailRepository emailRepository;
    @Autowired
    private AddressRepository addressRepository;

    @GetMapping("/")
    public List<Person> readAllPeople() {
        return personRepository.findAll();
    }

    @GetMapping("")
    public List<Object> readPeopleByName(@RequestParam String name) {
        List<Person> foundPeople = personRepository.findByFullNameIgnoreCase(name);
        List<Email> foundEmails = new ArrayList<>();
        List<Address> foundAddresses = new ArrayList<>();
        for (Person person : foundPeople) {
            foundEmails.addAll(emailRepository.findByPerson(person));
        }
        for (Person person : foundPeople) {
            foundAddresses.addAll(addressRepository.findByPerson(person));
        }
        List<Object> combinedList = new ArrayList<>();
        combinedList.addAll(foundPeople);
        combinedList.addAll(foundEmails);
        combinedList.addAll(foundAddresses);
        return combinedList;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> readPersonById(@PathVariable Long id) {
        Optional<Person> personOptional = personRepository.findById(id);
        if (personOptional.isPresent()) {
            Person person = personOptional.get();
            List<Email> foundEmails = emailRepository.findByPerson(person);
            List<Address> foundAddresses = addressRepository.findByPerson(person);
            PersonDTO personDto = new PersonDTO(person, foundEmails, foundAddresses);

            return ResponseEntity.ok(personDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("")
    public ResponseEntity<?> createPerson(@RequestBody PersonDTO requestDTO) {
        Person person = requestDTO.getPerson();
        List<Email> emails = requestDTO.getEmails();
        List<Address> addresses = requestDTO.getAddresses();

        if (person == null) {
            return ResponseEntity.badRequest().body("Person is required.");
        }
        if (emails == null || emails.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one email address is required.");
        }
        if (addresses == null || addresses.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one address is required.");
        }

        ResponseEntity<?> personCheck = validatePerson(person);
        if (personCheck.getStatusCode() != HttpStatus.OK) {
            return personCheck;
        }
        Person extractedPerson = personRepository.save(person);

        for (Email extractedEmail : emails) {
            ResponseEntity<?> emailCheck = validateEmail(extractedEmail);
            if (emailCheck.getStatusCode() != HttpStatus.OK) {
                return emailCheck;
            }
            Email email = new Email();
            email.setEmailType(extractedEmail.getEmailType());
            email.setEmail(extractedEmail.getEmail());
            email.setPerson(extractedPerson);
            emailRepository.save(email);
        }

        for (Address extractedAddress : addresses) {
            ResponseEntity<?> addressCheck = validateAddress(extractedAddress);
            if (addressCheck.getStatusCode() != HttpStatus.OK) {
                return addressCheck;
            }
            Address address = new Address();
            address.setAddressType(extractedAddress.getAddressType());
            address.setAddress(extractedAddress.getAddress());
            address.setPerson(extractedPerson);
            addressRepository.save(address);
        }

        return ResponseEntity
                .ok("Record for '" + extractedPerson.getFullName() + "' has been successfully created.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePerson(@PathVariable Long id, @RequestBody PersonDTO requestDTO) {
        Person updatedPerson = requestDTO.getPerson();
        List<Email> updatedEmails = requestDTO.getEmails();
        List<Address> updatedAddresses = requestDTO.getAddresses();

        if (updatedPerson == null) {
            return ResponseEntity.badRequest().body("Person is required.");
        }
        if (updatedEmails == null || updatedEmails.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one email address is required.");
        }
        if (updatedAddresses == null || updatedAddresses.isEmpty()) {
            return ResponseEntity.badRequest().body("At least one address is required.");
        }

        // Check person exists
        Optional<Person> existingPersonOptional = personRepository.findById(id);
        if (existingPersonOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Person existingPerson = existingPersonOptional.get();

        ResponseEntity<?> personCheck = validatePerson(updatedPerson);
        if (personCheck.getStatusCode() != HttpStatus.OK) {
            return personCheck;
        }

        // Update, delete, and add emails
        List<Email> existingEmails = emailRepository.findByPerson(existingPerson);
        for (Email existingEmail : existingEmails) {
            boolean emailFound = false;
            for (Email updatedEmail : updatedEmails) {
                if (existingEmail.getId().equals(updatedEmail.getId())) {
                    ResponseEntity<?> emailCheck = validateEmail(updatedEmail);
                    if (emailCheck.getStatusCode() != HttpStatus.OK) {
                        return emailCheck;
                    }
                    // Update the existing email with new data
                    existingEmail.setEmailType(updatedEmail.getEmailType());
                    existingEmail.setEmail(updatedEmail.getEmail());
                    emailRepository.save(existingEmail);
                    emailFound = true;
                    break;
                }
            }
            if (!emailFound) {
                // Delete the email if it's not in the updated list
                emailRepository.delete(existingEmail);
            }
        }

        for (Email updatedEmail : updatedEmails) {
            if (updatedEmail.getId() == null) {
                // Add new email records
                updatedEmail.setPerson(existingPerson);
                emailRepository.save(updatedEmail);
            }
        }

        // Update, delete, and add addresses
        List<Address> existingAddresses = addressRepository.findByPerson(existingPerson);
        for (Address existingAddress : existingAddresses) {
            boolean addressFound = false;
            for (Address updatedAddress : updatedAddresses) {
                if (existingAddress.getId().equals(updatedAddress.getId())) {
                    ResponseEntity<?> addressCheck = validateAddress(updatedAddress);
                    if (addressCheck.getStatusCode() != HttpStatus.OK) {
                        return addressCheck;
                    }
                    // Update the existing address with new data
                    existingAddress.setAddressType(updatedAddress.getAddressType());
                    existingAddress.setAddress(updatedAddress.getAddress());
                    addressRepository.save(existingAddress);
                    addressFound = true;
                    break;
                }
            }
            if (!addressFound) {
                // Delete the address if it's not in the updated list
                addressRepository.delete(existingAddress);
            }
        }

        for (Address updatedAddress : updatedAddresses) {
            if (updatedAddress.getId() == null) {
                // Add new address records
                updatedAddress.setPerson(existingPerson);
                addressRepository.save(updatedAddress);
            }
        }

        // Update the existing person with new data
        existingPerson.setFullName(updatedPerson.getFullName());
        existingPerson.setPin(updatedPerson.getPin());

        Person savedPerson = personRepository.save(existingPerson);

        return ResponseEntity.ok("Record for '" + savedPerson.getFullName() + "' has been successfully updated.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable Long id) {
        Optional<Person> existingPersonOptional = personRepository.findById(id);
        if (existingPersonOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Person existingPerson = existingPersonOptional.get();

        // Delete associated emails and addresses
        List<Email> existingEmails = emailRepository.findByPerson(existingPerson);
        for (Email existingEmail : existingEmails) {
            emailRepository.delete(existingEmail);
        }

        List<Address> existingAddresses = addressRepository.findByPerson(existingPerson);
        for (Address existingAddress : existingAddresses) {
            addressRepository.delete(existingAddress);
        }

        // Delete the person
        personRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<?> validatePerson(Person person) {
        if (person.getFullName() == null || person.getFullName().isEmpty()) {
            return ResponseEntity.badRequest().body("Full name is required.");
        }
        // if (person.getPin() == null || person.getPin().isEmpty()) {
        // return ResponseEntity.badRequest().body("PIN is required.");
        // }
        if ((person.getPin() != null && !person.getPin().isEmpty()) && person.getPin().length() != 10) {
            return ResponseEntity.badRequest().body("PIN must be exactly 10 characters long.");
        }
        return ResponseEntity.ok("Record OK.");
    }

    public ResponseEntity<?> validateEmail(Email email) {
        String emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$";
        if (email.getEmailType() == null || email.getEmailType().isEmpty()) {
            return ResponseEntity.badRequest().body("Email type is required.");
        }
        // if (email.getEmail() == null || email.getEmail().isEmpty()) {
        // return ResponseEntity.badRequest().body("Email is required.");
        // }
        Pattern pattern = Pattern.compile(emailRegex);
        if (!pattern.matcher(email.getEmail()).matches()) {
            return ResponseEntity.badRequest().body("Email is invalid.");
        }
        return ResponseEntity.ok("Record OK.");
    }

    public ResponseEntity<?> validateAddress(Address address) {
        if (address.getAddressType() == null || address.getAddressType().isEmpty()) {
            return ResponseEntity.badRequest().body("Address type is required for " + address);
        }
        // if (address.getAddress() == null || (address.getAddress().isEmpty())) {
        // return ResponseEntity.badRequest().body("Full name is required.");
        // }
        return ResponseEntity.ok("Record OK.");
    }

}
