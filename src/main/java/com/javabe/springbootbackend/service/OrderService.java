package com.javabe.springbootbackend.service;

import com.javabe.springbootbackend.exceptions.OrderNotFoundException;
import com.javabe.springbootbackend.exceptions.ProductNotFoundException;
import com.javabe.springbootbackend.model.Order;
import com.javabe.springbootbackend.model.Product;
import com.javabe.springbootbackend.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


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

    public Order findById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + orderId));
    }

    public void createOrder(Order order, List<Integer> productIds) {


        List<Product> products = new ArrayList<>();
        double totalOrderPrice = 0.0;


        for (Integer productId : productIds) {
            Product product = productService.findById(productId);
            product.setStatus("sold");
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
        if(order.getDeliveryOptions().equals("Meetup")){
            order.setShippingFee(0);
        }
        order.setProducts(products);
        order.setTotalPrice(totalOrderPrice+order.getShippingFee());
        orderRepository.save(order);
    }

    public void deleteOrderById(Integer orderId) {


        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException("Order not found with ID: " + orderId));

        List<Product> products=order.getProducts();
        for(Product product:products){
            product.setStatus("Available");
        }
        order.setProducts(null);

                orderRepository.delete(order);
    }

    public List<Order> getOrdersByPaid(Boolean isPaid) {
        return orderRepository.findByIsPaid(isPaid);
    }

    public List<Order> getOrdersByDeliveryOptions(String deliveryOptions) {
        return orderRepository.findByDeliveryOptions(deliveryOptions);
    }

    public List<Order> getOrdersByTotalPriceGreaterThan(Double totalPriceGreaterThan) {
        return orderRepository.findByTotalPriceGreaterThan(totalPriceGreaterThan);
    }

    public void updateOrder(Integer orderId, Order updatedOrder) {
        Optional<Order> existingOrderOptional = orderRepository.findById(orderId);

        if (existingOrderOptional.isPresent()) {
            Order existingOrder = existingOrderOptional.get();

            // Update the fields of the existing product with the values from the updated product
            existingOrder.setCustomerName(updatedOrder.getCustomerName());
            existingOrder.setTotalPrice(updatedOrder.getTotalPrice());
            existingOrder.setDeliveryOptions(updatedOrder.getDeliveryOptions());
            existingOrder.setShippingFee(updatedOrder.getShippingFee());
            existingOrder.setIsPaid(updatedOrder.getIsPaid());

            // Save the updated product
            orderRepository.save(existingOrder);
        } else {
            throw new ProductNotFoundException("Product not found with id: " + orderId);
        }
    }
}
