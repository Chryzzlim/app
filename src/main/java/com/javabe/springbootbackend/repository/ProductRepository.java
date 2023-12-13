package com.javabe.springbootbackend.repository;

import com.javabe.springbootbackend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Integer> {
}
