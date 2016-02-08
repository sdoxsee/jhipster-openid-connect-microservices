package com.mycompany.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

import com.mycompany.myapp.domain.Foo;

@SpringBootApplication
@EnableResourceServer
@EnableDiscoveryClient
public class FooServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(FooServiceApplication.class, args);
    }

    @Configuration
    public static class RepositoryConfig extends RepositoryRestMvcConfiguration {
        @Override
        protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
            config.exposeIdsFor(Foo.class);
        }
    }

     @Bean
     public ResourceServerConfigurer resourceServer(SecurityProperties securityProperties) {
         return new ResourceServerConfigurerAdapter() {
             @Override
             public void configure(ResourceServerSecurityConfigurer resources) {
                 resources.resourceId("foo");
             }
    
             @Override
             public void configure(HttpSecurity http) throws Exception {
                 if (securityProperties.isRequireSsl()) {
                     http.requiresChannel().anyRequest().requiresSecure();
                 }
                 http
                         .authorizeRequests()
                         .antMatchers(HttpMethod.GET, "/**").access("#oauth2.hasScope('foo.read')")
                         .antMatchers(HttpMethod.POST, "/**").access("#oauth2.hasScope('foo.write')")
                         .antMatchers(HttpMethod.PUT, "/**").access("#oauth2.hasScope('foo.write')")
                         .antMatchers(HttpMethod.DELETE, "/**").access("#oauth2.hasScope('foo.write')");
             }
         };
     }

}
