package com.javabe.springbootbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String customerName;

    @OneToMany(orphanRemoval = true)
    @JoinColumn(name = "order_id")
    @JsonIgnoreProperties("order")
    private List<Product> products = new ArrayList<>();


    private double totalPrice;


    private boolean isPaid;
    private boolean isMeetup;

    public void setIsPaid(boolean paid) {
        isPaid = paid;
    }

    public void setIsMeetup(boolean meetup) {
        isMeetup = meetup;
    }

    public boolean getIsPaid() {
        return isPaid;
    }

    public boolean getIsMeetup() {
        return isMeetup;
    }

    public Order() {
    }

    public Order(int id, String customerName, long totalPrice, boolean isPaid, boolean isMeetup) {
        this.id = id;
        this.customerName = customerName;
        this.totalPrice = totalPrice;
        this.isPaid = isPaid;
        this.isMeetup = isMeetup;
    }
}
