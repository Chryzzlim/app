package com.javabe.springbootbackend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String getIndex() {
        return "index"; // This corresponds to the name of your HTML file (without the extension)
    }
}

