package com.javabe.springbootbackend.exceptions;

public class ProductNotFoundException extends RuntimeException{
    public ProductNotFoundException(String message){
        super (message);
    }
}
