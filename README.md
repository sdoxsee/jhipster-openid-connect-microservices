# jhipster-openid-connect-microservices

Based on JHipster (https://github.com/jhipster/generator-jhipster) 2.27.0 and borrowing heavily from https://github.com/william-tran/microservice-security, this project uses https://github.com/cloudfoundry/uaa as OpenID Connect Provider (or OAuth2 Authorization Server) to authenticate users and request authorization to the JHipster client to access protected resources (microservices) like 'foo-service'. Services are registered and discovered through the eureka-server.

NOTE: Since we're using uaa as an OpenID Connect Provider rather than simply an OAuth2 Authorization Server (although uaa is also that), you could essentially plug in any OpenID Connect Provider (like Keycloak, MitreID, Google, etc.) :D

# Running everything
1. Start uaa (http://localhost:8080/uaa/profile) with users/clients/keys as configured in ```uaa/uaa.yml```
  
  NOTE: uaa should be fully up before starting other services (especially foo-service) as they will need uaa's public key after it is up and published

  ```
    cd uaa
    mvn cargo:run
  ```  

2. Start eureka-server (http://localhost:8761)

  ```
    cd eureka-server
    mvn spring-boot:run
  ```

3. Start foo-service (http://localhost:8083)

  ```
    cd foo-service
    mvn spring-boot:run
  ```
  
4. Start admin-portal (http://localhost:8084)

  ```
    cd admin-portal
    mvn
  ```

5. Sign in to admin-portal as ```freddy|demo```
6. As "freddy", approve authorization scopes to the admin-portal client application
7. Add a foo entity to see the jhipster app work with an oauth2 protected microservice

# Disclaimers

* ROLE_ADMIN and ROLE_USER mean less in an OpenID Connect scenario. Resources (whether microservices or UI permissions) should be limited by "scopes". I've returned the scopes as the authorities from the user at the ```api/account``` endpoint. The foo-service endpoints will be authorized if the JWT token has the 'foo.admin' scope.
* Other than the foo entity, the rest of the application is still vanilla jhipster with its own database
* There is no hysterix circuit breaking or ribbon load balancing yet. 
* There's plenty more to do here but I don't have the time. Please do ask any clarifying questions (maybe in the "issues") but I'll need someone else to get this of thing into the yeoman generator.

