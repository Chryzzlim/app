package com.javabe.springbootbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Map this to the path of your API
                .allowedOrigins("http://localhost:63342/springboot-backend/templates/index.html?_ijt=7d3t0qcbq3eq33rcg7ciqs4m25&_ij_reload=RELOAD_ON_SAVE") // Replace with your frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}

