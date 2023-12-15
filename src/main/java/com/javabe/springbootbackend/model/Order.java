package com.javabe.springbootbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@Table(name = "orders")
@AllArgsConstructor
@NoArgsConstructor
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

    private String deliveryOptions;

    private double shippingFee;


    public void setIsPaid(boolean paid) {
        isPaid = paid;
    }


    public boolean getIsPaid() {
        return isPaid;
    }




}
