package com.javabe.springbootbackend.repository;

import com.javabe.springbootbackend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByIsPaid(Boolean isPaid);

    List<Order> findByIsMeetup(Boolean isMeetup);

    List<Order> findByTotalPriceGreaterThan(Double totalPriceGreaterThan);
}
