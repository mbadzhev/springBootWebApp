package mbadzhev.webapp.server.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "T_ADDRESSES")
public class Address {
    @Id
    @Column(name = "ID")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "T_PEOPLE_ID")
    @JsonIgnore
    private Person person;
    @Column(name = "ADDR_TYPE")
    private String addressType;
    @Column(name = "ADDR_INFO")
    private String addressInfo;

    public Address() {
    }

    public Address(Long id, Person person, String addressType, String addressInfo) {
        this.id = id;
        this.person = person;
        this.addressType = addressType;
        this.addressInfo = addressInfo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public String getAddressType() {
        return addressType;
    }

    public void setAddressType(String addressType) {
        this.addressType = addressType;
    }

    public String getAddress() {
        return addressInfo;
    }

    public void setAddress(String addressInfo) {
        this.addressInfo = addressInfo;
    }
}
