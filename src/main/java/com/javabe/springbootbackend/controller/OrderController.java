package com.javabe.springbootbackend.controller;

import com.javabe.springbootbackend.exceptions.OrderNotFoundException;
import com.javabe.springbootbackend.model.Order;
import com.javabe.springbootbackend.model.Product;
import com.javabe.springbootbackend.repository.OrderRepository;
import com.javabe.springbootbackend.repository.ProductRepository;
import com.javabe.springbootbackend.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@Transactional
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }

    @PostMapping("/createOrder")
    public ResponseEntity<String> createOrder(@RequestBody Order order, @RequestParam List<Integer> productIds) {
        try {
            orderService.createOrder(order, productIds);
            return ResponseEntity.ok("Order created successfully");
        } catch (Exception e) {
            // Handle the exception appropriately
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating order");
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<String> deleteOrderById(@PathVariable Integer orderId) {
        try {
            orderService.deleteOrderById(orderId);
            return ResponseEntity.ok("Order deleted successfully");
        } catch (OrderNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting order");
        }
    }


    @GetMapping("/filter")
    public ResponseEntity<List<Order>> getFilteredOrders(@RequestParam(required = false) Boolean isPaid, @RequestParam(required = false) Boolean isMeetup) {
        // Check if either isPaid or isMeetup is specified
        if (isPaid != null) {
            List<Order> filteredOrders = orderService.getOrdersByPaid(isPaid);
            return ResponseEntity.ok(filteredOrders);
        } else if (isMeetup != null) {
            List<Order> filteredOrders = orderService.getOrdersByMeetup(isMeetup);
            return ResponseEntity.ok(filteredOrders);
        } else {
            // If neither is specified, return all orders
            List<Order> allOrders = orderService.getAllOrders();
            return ResponseEntity.ok(allOrders);
        }
    }


    // Handler method to filter orders by total price greater than a value
    @GetMapping("/orders/filterByTotalPriceGreaterThan")
    public ResponseEntity<List<Order>> getOrdersByTotalPriceGreaterThan(@RequestParam Double totalPriceGreaterThan) {
        List<Order> filteredOrders = orderService.getOrdersByTotalPriceGreaterThan(totalPriceGreaterThan);
        return ResponseEntity.ok(filteredOrders);
    }
}
