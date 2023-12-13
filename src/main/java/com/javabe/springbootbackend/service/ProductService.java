package com.javabe.springbootbackend.service;

import com.javabe.springbootbackend.exceptions.ProductNotFoundException;
import com.javabe.springbootbackend.model.Product;
import com.javabe.springbootbackend.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    public void saveProduct(Product product){
        productRepository.save(product);
    }

    public Product findById(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));
    }

    public void deleteProductById(Integer productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + productId));

        // Disassociate the product from any order before deletion (if necessary)
        if (product.getOrder() != null) {
            product.getOrder().getProducts().remove(product);
            product.setOrder(null);
        }

        productRepository.delete(product);
    }


    public void updateProduct(Integer productId, Product updatedProduct) {
        Optional<Product> existingProductOptional = productRepository.findById(productId);

        if (existingProductOptional.isPresent()) {
            Product existingProduct = existingProductOptional.get();

            // Update the fields of the existing product with the values from the updated product
            existingProduct.setName(updatedProduct.getName());
            existingProduct.setPrice(updatedProduct.getPrice());

            // Save the updated product
            productRepository.save(existingProduct);
        } else {
            throw new ProductNotFoundException("Product not found with id: " + productId);
        }
    }
}
