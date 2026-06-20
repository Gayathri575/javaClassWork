package com.example.JavaNotes.controller;

import com.example.JavaNotes.dto.AuthRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final Set<String> usedCodes = Collections.synchronizedSet(new HashSet<>());

    @Value("${keycloak.server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Value("${keycloak.admin-client-id}")
    private String adminClientId;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;


    @PostMapping("/callback")
    public ResponseEntity<Map<String, Object>> callback(@RequestBody Map<String, String> body,
                                                        HttpServletRequest request) {
        System.out.println("📍 Request from IP: " + request.getRemoteAddr());
        System.out.println("📍 User-Agent: " + request.getHeader("User-Agent"));
        System.out.println("📍 Origin: " + request.getHeader("Origin"));
        System.out.println("📍 Referer: " + request.getHeader("Referer"));

        String code = body.get("code");
        String redirectUri = body.get("redirectUri");

        System.out.println("📍 code received: " + code);
        System.out.println("📍 redirectUri: " + redirectUri);

        if (code == null) {
            return ResponseEntity.status(400).body(Map.of("message", "invalid_code"));
        }

        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("grant_type",    "authorization_code");
            form.add("client_id",     clientId);
            form.add("client_secret", clientSecret);
            form.add("code",          code);
            form.add("redirect_uri",  redirectUri);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            System.out.println("📍 Sending to: " + tokenUrl);

            ResponseEntity<Map> response = new RestTemplate().postForEntity(
                    tokenUrl,
                    new HttpEntity<>(form, headers),
                    Map.class
            );

            System.out.println("✅ Token exchange success!");
            return ResponseEntity.ok(response.getBody());

        } catch (HttpClientErrorException e) {
            System.out.println("❌ Keycloak error: " + e.getResponseBodyAsString());
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Token exchange failed"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthRequest req) {
        try {
            String adminToken = getAdminToken();

            Map<String, Object> user = new HashMap<>();
            user.put("username",  req.getUsername());
            user.put("email",     req.getEmail());
            user.put("firstName", req.getFirstName());
            user.put("lastName",  req.getLastName());
            user.put("enabled",   true);
            user.put("credentials", List.of(Map.of(
                    "type",      "password",
                    "value",     req.getPassword(),
                    "temporary", false
            )));

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(adminToken);
            headers.setContentType(MediaType.APPLICATION_JSON);

            ResponseEntity<String> response = new RestTemplate().exchange(
                    keycloakUrl + "/admin/realms/" + realm + "/users",
                    HttpMethod.POST,
                    new HttpEntity<>(user, headers),
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.CREATED) {
                return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
            }

            return ResponseEntity.badRequest().body(Map.of("message", "Registration failed."));

        } catch (HttpClientErrorException e) {
            String body = e.getResponseBodyAsString();
            if (body.contains("User exists")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Username or email already exists."));
            }
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Server error: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthRequest request) {
        try {
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type",    "password");
            body.add("client_id",     clientId);
            body.add("client_secret", clientSecret);
            body.add("username",      request.getUsername());
            body.add("password",      request.getPassword());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            ResponseEntity<Map> response = new RestTemplate().postForEntity(
                    keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token",
                    new HttpEntity<>(body, headers),
                    Map.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (HttpClientErrorException e) {
            return ResponseEntity.status(401)
                    .body(Map.of("message", "Invalid username or password"));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<String> me(Authentication authentication) {
        return ResponseEntity.ok("Logged in as: " + authentication.getName());
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> delete(Authentication authentication) {
        return ResponseEntity.ok("Delete endpoint - configure as needed");
    }


    private String getAdminToken() {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id",  adminClientId);
        body.add("username",   adminUsername);
        body.add("password",   adminPassword);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<Map> res = new RestTemplate().postForEntity(
                keycloakUrl + "/realms/master/protocol/openid-connect/token",
                new HttpEntity<>(body, headers),
                Map.class
        );

        return (String) res.getBody().get("access_token");
    }
}




