package com.javabe.springbootbackend.service;

import com.javabe.springbootbackend.exceptions.OrderNotFoundException;
import com.javabe.springbootbackend.model.Order;
import com.javabe.springbootbackend.model.Product;
import com.javabe.springbootbackend.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@Transactional
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private  ProductService productService;

    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    public void createOrder(Order order, List<Integer> productIds) {


        List<Product> products = new ArrayList<>();
        double totalOrderPrice = 0.0;


        for (Integer productId : productIds) {
            Product product = productService.findById(productId);
            if (product.getOrder() != null) {
                // If the product is already associated with an order, skip it
                System.out.println("Product " + productId + " is already associated with an order: " + product.getOrder().getId());
            } else {
                // Associate the product with the order
                product.setOrder(order);
                products.add(product);

                // Add the price of the Product to the total order price
                totalOrderPrice += product.getPrice();
            }
        }
        order.setProducts(products);
        order.setTotalPrice(totalOrderPrice);
        orderRepository.save(order);
    }

    public void deleteOrderById(Integer orderId) {


        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        order.setProducts(null);
                orderRepository.delete(order);
    }

    public List<Order> getOrdersByPaid(Boolean isPaid) {
        return orderRepository.findByIsPaid(isPaid);
    }

    public List<Order> getOrdersByMeetup(Boolean isMeetup) {
        return orderRepository.findByIsMeetup(isMeetup);
    }

    public List<Order> getOrdersByTotalPriceGreaterThan(Double totalPriceGreaterThan) {
        return orderRepository.findByTotalPriceGreaterThan(totalPriceGreaterThan);
    }
}
